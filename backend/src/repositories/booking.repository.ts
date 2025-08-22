import { FilterQuery } from "mongoose";
import { BookingCreateRequestDto } from "../dto/booking.dto";
import Booking, { IBooking } from "../models/booking.model";
import { BaseRepository } from "./base.repository";
import { IBookingRepository } from "./interfaces/IBookingRepository";
import { injectable } from "inversify";

@injectable()
export class BookingRepository
  extends BaseRepository<IBooking>
  implements IBookingRepository
{
  constructor() {
    super(Booking);
  }

  async createBooking(
    userId: string,
    data: BookingCreateRequestDto
  ): Promise<IBooking | null> {
    return await Booking.create({
      user: userId,
      barber: data.barberId,
      totalPrice: data.price,
      finalPrice: data.price,
      service: data.serviceId,
      slotDetails: {
        startTime: data.startTime,
        endTime: data.endTime,
        date: data.date,
      },
    });
  }

  async findSimilarBooking(
    data: BookingCreateRequestDto
  ): Promise<IBooking | null> {
    return await Booking.findOne({
      barber: data.barberId,
      "slotDetails.date": data.date,
      "slotDetails.startTime": data.startTime,
      "slotDetails.endTime": data.endTime,
    });
  }

  async findWithPaginationAndCount(
    filter: FilterQuery<IBooking>,
    skip: number,
    limit: number
  ): Promise<{ bookings: IBooking[]; totalCount: number }> {
    const [bookings, totalCount] = await Promise.all([
      this.findWithPagination(filter, skip, limit), // from base repo
      this.countDocuments(filter), // from base repo
    ]);
    return { bookings, totalCount };
  }
}
