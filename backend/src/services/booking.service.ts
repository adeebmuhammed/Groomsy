import mongoose, { FilterQuery } from "mongoose";
import {
  BookingCreateRequestDto,
  BookingResponseDto,
  confirmBookingDto,
} from "../dto/booking.dto";
import { IBooking } from "../models/booking.model";
import { BarberRepository } from "../repositories/barber.repository";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { MESSAGES, ROLES, STATUS_CODES } from "../utils/constants";
import { IBookingService } from "./interfaces/IBookingService";
import { MessageResponseDto } from "../dto/base.dto";
import { IServiceRepository } from "../repositories/interfaces/IServiceRepository";
import { ServiceRepository } from "../repositories/service.repository";
import { IBarberUnavailabilityRepository } from "../repositories/interfaces/IBarberUnavailabilityRepository";
import { BarberUnavailabilityRepository } from "../repositories/barber.unavailability.repository";
import { BookingMapper } from "../mappers/booking.mapper";
import { ICouponRepository } from "../repositories/interfaces/ICouponRepository";
import { CouponResitory } from "../repositories/coupon.repository";
import razorpayInstance from "../utils/razorpay";
import crypto from "crypto";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.IBookingRepository) private _bookingRepo: IBookingRepository,
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.IBarberRepository) private _barberRepo: IBarberRepository,
    @inject(TYPES.IServiceRepository) private _serviceRepo: IServiceRepository,
    @inject(TYPES.IBarberUnavailabilityRepository)
    private _barberUnavailabilityRepo: IBarberUnavailabilityRepository,
    @inject(TYPES.ICouponRepository) private _couponRepo: ICouponRepository
  ) {}

  fetchBookings = async (
    role: ROLES,
    id?: string,
    page: number = 1,
    limit: number = 5
  ): Promise<{
    response: { data: BookingResponseDto[]; totalCount: number };
    status: number;
  }> => {
    const skip = (page - 1) * limit;
    const filter: Partial<{ user: string; barber: string }> = {};

    if (role === ROLES.USER) {
      if (!id) throw new Error("User ID is required");
      filter.user = id;
    } else if (role === ROLES.BARBER) {
      if (!id) throw new Error("Barber ID is required");
      filter.barber = id;
    } else if (role !== ROLES.ADMIN) {
      throw new Error("Invalid role");
    }

    const { bookings, totalCount } =
      await this._bookingRepo.findWithPaginationAndCount(filter, skip, limit);

    const bookingDTOs: BookingResponseDto[] =
      BookingMapper.toBookingResponseArray(bookings);

    return {
      response: { data: bookingDTOs, totalCount },
      status: STATUS_CODES.OK,
    };
  };

  stageBooking = async (
    userId: string,
    data: BookingCreateRequestDto
  ): Promise<{ response: BookingResponseDto; status: number }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);

    const barber = await this._barberRepo.findById(data.barberId);
    if (!barber) throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);

    const unavailability = await this._barberUnavailabilityRepo.findOne({
      barber: data.barberId,
    });
    if (!unavailability) throw new Error("barber unavailability not found");

    const service = await this._serviceRepo.findById(data.serviceId);
    if (!service) throw new Error("service not found");

    const bookingDate = new Date(data.startTime);
    const bookingDayName = bookingDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (bookingDayName === unavailability.weeklyOff) {
      throw new Error(
        `Cannot book on ${bookingDayName}, barber is unavailable (weekly off)`
      );
    }

    const bookingDateStr = bookingDate.toISOString().split("T")[0];
    const isSpecialOff = unavailability.specialOffDays.some(
      (offDay) => offDay.date === bookingDateStr
    );

    if (isSpecialOff) {
      throw new Error(
        `Cannot book on ${bookingDateStr}, barber has a special off`
      );
    }

    const activeStaged = await this._bookingRepo.find({
    user: userId,
    status: "staged"
  });

  if (activeStaged.length >= 2) {
    throw new Error("You already have the maximum allowed active holds");
  }

    const similarBooking = await this._bookingRepo.findSimilarBooking(data);
    if (similarBooking) throw new Error("slot is already booked");

    const createBooking: Partial<IBooking> = {
      user: new mongoose.Types.ObjectId(userId),
      barber: new mongoose.Types.ObjectId(data.barberId),
      service: new mongoose.Types.ObjectId(data.serviceId),
      totalPrice: data.price,
      finalPrice: data.price,
      slotDetails:{
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime
      },
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    }

    const booking = await this._bookingRepo.create(createBooking);
    if (!booking) {
      throw new Error("staging booking failed");
    }

    const response: BookingResponseDto =
      BookingMapper.toBookingResponse(booking);

    return {
      response,
      status: STATUS_CODES.OK,
    };
  };

  couponApplication = async (
    bookingId: string,
    couponCode: string
  ): Promise<{ response: BookingResponseDto; status: number }> => {
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) {
      throw new Error("booking not found");
    }

    const coupon = await this._couponRepo.findOne({ code: couponCode });
    if (!coupon) {
      throw new Error("invalid coupon code");
    }

    let finalPrice;
    if (booking.totalPrice >= coupon.limitAmount) {
      if (coupon.maxCount > coupon.usedCount) {
        finalPrice = booking.totalPrice - coupon.couponAmount;
      } else {
        throw new Error("coupon used count exceeded");
      }
    } else {
      throw new Error(
        "total price must be greater than or equal to coupon limit amount"
      );
    }

    const updatedBooking = await this._bookingRepo.update(bookingId, {
      finalPrice,
      couponCode,
      discountAmount: booking.totalPrice - finalPrice,
    });
    if (!updatedBooking) {
      throw new Error("coupon application failed");
    }

    const response: BookingResponseDto =
      BookingMapper.toBookingResponse(updatedBooking);

    return {
      response,
      status: STATUS_CODES.OK,
    };
  };

  confirmBooking = async (
    bookingId: string,
    userId: string,
    data: {
      finalPrice?: number;
      couponCode?: string;
      discountAmount?: number;
    }
  ): Promise<{ response: confirmBookingDto; status: number }> => {
    
    const booking = await this._bookingRepo.findById(bookingId);

    if (!booking) throw new Error("Booking not found");
    if (booking.user.toString() !== userId) throw new Error("Unauthorized");
    if (booking.status !== "staged")
      throw new Error("Booking is not in staged state");

    booking.finalPrice = data.finalPrice ?? booking.totalPrice;
    booking.couponCode = data.couponCode ?? undefined;
    booking.discountAmount = data.discountAmount ?? 0;

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(booking.finalPrice * 100), // amount in paise
      currency: "INR",
      receipt: bookingId,
    });

    booking.razorpayOrderId = razorpayOrder.id;
    const updated = await this._bookingRepo.update(
      booking._id as string,
      booking
    );
    if (!updated) {
      throw new Error("booking confirmation failed");
    }

    return {
      response: {
        message: "Razorpay order created successfully",
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        bookingId: booking._id as string,
        keyId: process.env.RAZORPAY_KEY_ID as string,
      },
      status: STATUS_CODES.OK,
    };
  };

  verfyPayment = async (
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
    bookingId: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const booking = await this._bookingRepo.findById(bookingId);
      if (!booking) throw new Error("Booking not found");

      booking.status = "pending";
      booking.expiresAt = undefined;
      const updated = await this._bookingRepo.update(
        booking._id as string,
        booking
      );
      if (!updated) {
        throw new Error("payment verfication failed");
      }
    } else {
      throw new Error("Invalid payment signature");
    }

    return {
      response: { message: "payment verified successfully" },
      status: STATUS_CODES.OK,
    };
  };

  updateBookingStatus = async (
    role: ROLES.USER | ROLES.BARBER,
    bookingId: string,
    bookingStatus: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    if (role !== "user" && role !== "barber") {
      throw new Error("invalid role");
    }

    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) {
      throw new Error("booking not found");
    }

    if (booking.status === "finished") {
      throw new Error("the booking appointment is already finished");
    }

    if (booking.status === bookingStatus) {
      throw new Error(`booking status is already ${bookingStatus}`);
    }

    if (role === "user") {
      if (booking.status === "pending" && bookingStatus === "cancel") {
        booking.status = "cancelled_by_user";
      } else {
        throw new Error("Invalid status transition for user");
      }
    } else if (role === "barber") {
      if (booking.status === "pending" && bookingStatus === "cancel") {
        booking.status = "cancelled_by_barber";
      } else if (booking.status === "pending" && bookingStatus === "finished") {
        booking.status = "finished";
      } else {
        throw new Error("Invalid status transition for barber");
      }
    }

    const updatedBooking = await this._bookingRepo.update(
      booking.id.toString(),
      booking
    );
    if (!updatedBooking) {
      throw new Error("status updation failed");
    }

    return {
      response: { message: "booking status updated successfully" },
      status: STATUS_CODES.OK,
    };
  };

  getBookingById = async (
    bookingId: string
  ): Promise<{ response: BookingResponseDto; status: number }> => {
    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) {
      throw new Error("booking not found");
    }

    return {
      response: BookingMapper.toBookingResponse(booking),
      status: STATUS_CODES.OK,
    };
  };

  getBookingsByStatus = async (
    status: "pending" | "staged" | "cancelled" | "finished",
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    response: { data: BookingResponseDto[]; totalCount: number };
    status: number;
  }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const allowedStatuses = ["pending", "staged", "cancelled", "finished"];
    if (!allowedStatuses.includes(status)) {
      throw new Error("invalid booking status");
    }

    const filter: FilterQuery<IBooking> = {
      user: userId,
      status:
        status === "cancelled"
          ? { $in: ["cancelled_by_user", "cancelled_by_barber"] }
          : status,
    };

    const skip = (page - 1) * limit;

    const { bookings, totalCount } =
      await this._bookingRepo.findWithPaginationAndCount(filter, skip, limit);

    return {
      response: {
        data: BookingMapper.toBookingResponseArray(bookings),
        totalCount,
      },
      status: STATUS_CODES.OK,
    };
  };
}
