import { BookingCreateRequestDto } from "../dto/booking.dto";
import Booking, { IBooking } from "../models/booking.model";
import { BaseRepository } from "./base.repository";
import { IBookingRepository } from "./interfaces/IBookingRepository";

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
}
