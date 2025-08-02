import {
  BookingCreateRequestDto,
  MessageResponseDto,
} from "../dto/booking.dto";
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
    role: "user" | "barber",
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
}
