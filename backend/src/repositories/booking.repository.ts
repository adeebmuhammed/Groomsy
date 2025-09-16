import { FilterQuery, UpdateResult } from "mongoose";
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
      this.findWithPagination(filter, skip, limit),
      this.countDocuments(filter),
    ]);
    return { bookings, totalCount };
  }

  async updateAfterVerfyPayment(
    bookingId: string
  ): Promise<UpdateResult | null> {
    return await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: { status: "pending" },
        $unset: { expiresAt: "" }, // remove expiry so TTL won’t delete it
      },
      { new: true }
    );
  }
}
