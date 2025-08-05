import mongoose from "mongoose";
import {
  BookingCreateRequestDto,
  BookingResponseDto,
  MessageResponseDto,
} from "../dto/booking.dto";
import { IBooking } from "../models/booking.model";
import { BarberRepository } from "../repositories/barber.repository";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IBookingService } from "./interfaces/IBookingService";

export class BookingService implements IBookingService {
  private _userRepo: IUserRepository;
  private _barberRepo: IBarberRepository;
  constructor(private _bookingRepo: IBookingRepository) {
    this._userRepo = new UserRepository();
    this._barberRepo = new BarberRepository();
  }

  fetchBookings = async (
    role: "user" | "barber" | "admin",
    id?: string,
    page: number = 1,
    limit: number = 5
  ): Promise<{ response: {data: BookingResponseDto[],totalCount: number}; status: number }> => {
    const skip = (page - 1) * limit;
    let bookings: IBooking[] = [];

    const filter: Partial<{ user: string; barber: string }> = {};
    if (role === "user") {
      filter.user = id;
    } else if (role === "barber") {
      filter.barber = id;
    } else if (role !== "admin") {
      throw new Error("invalid role");
    }

    bookings = await this._bookingRepo.findWithPagination(filter, skip, limit);

    const bookingDTOs: BookingResponseDto[] = bookings.map((booking) => ({
      id: (booking._id as mongoose.Types.ObjectId).toString(),
      user: booking.user.toString(),
      barber: booking.barber.toString(),
      totalPrice: booking.totalPrice,
      status: booking.status,
      slotDetails: {
        startTime: booking.slotDetails.startTime,
        endTime: booking.slotDetails.endTime,
        date: booking.slotDetails.date,
      },
    }));

    const data = bookingDTOs
    const totalCount = bookingDTOs.length

    return { response: {data,totalCount}, status: STATUS_CODES.OK };
  };

  createBooking = async (
    userId: string,
    data: BookingCreateRequestDto
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const barber = await this._barberRepo.findById(data.barberId);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const similarBooking = await this._bookingRepo.findSimilarBooking(data);
    if (similarBooking) {
      throw new Error("slot is already booked");
    }

    const booking = await this._bookingRepo.createBooking(userId, data);
    if (!booking) {
      throw new Error("booking creation failed");
    }

    return {
      response: { message: "slot booked successfully" },
      status: STATUS_CODES.OK,
    };
  };

  updateBookingStatus = async (
    role: "user" | "barber"| "admin" ,
    bookingId: string,
    bookingStatus: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    if (role !== "user" && role !== "barber" && role !== "admin") {
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
    }else if(role === "admin") {
      if (booking.status === "pending" && bookingStatus === "cancel") {
        booking.status = "cancelled_by_admin";
      } else {
        throw new Error("Invalid status transition for admin");
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
}
