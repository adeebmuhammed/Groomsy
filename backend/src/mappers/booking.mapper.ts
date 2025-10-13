import mongoose from "mongoose";
import { BookingResponseDto } from "../dto/booking.dto";
import { IBooking } from "../models/booking.model";
import { BookingStatsResponseDto } from "../dto/barber.dto";

export class BookingMapper {
  static toBookingResponse(data: IBooking): BookingResponseDto {
    return {
      id: (data._id as mongoose.Types.ObjectId).toString(),
      user: (data.user as mongoose.Types.ObjectId).toString(),
      barber: (data.barber as mongoose.Types.ObjectId).toString(),
      totalPrice: data.totalPrice,
      service: (data.service as mongoose.Types.ObjectId).toString(),
      status: data.status,
      finalPrice: data.finalPrice,
      discountAmount: data.discountAmount,
      couponCode: data.couponCode,
      slotDetails: {
        startTime: data.slotDetails.startTime,
        endTime: data.slotDetails.endTime,
        date: data.slotDetails.date,
      },
    };
  }

  static toBookingResponseArray(bookings: IBooking[]): BookingResponseDto[] {
    return bookings.map((booking) => this.toBookingResponse(booking));
  }

  static toBookingStatsResponseDto(labels: string[], counts: number[]): BookingStatsResponseDto[] {
    return labels.map((label, index) => new BookingStatsResponseDto(label, counts[index] || 0));
  }
}
