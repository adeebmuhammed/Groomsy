import { FilterQuery, UpdateResult } from "mongoose";
import { BookingCreateRequestDto } from "../../dto/booking.dto";
import { IBooking } from "../../models/booking.model";
import { IBaseRepository } from "./IBaseRepository";
import { DASHBOARDFILTERS } from "../../utils/constants";

export interface IBookingRepository extends IBaseRepository<IBooking> {
  findSimilarBooking(data: BookingCreateRequestDto): Promise<IBooking | null>;
  findWithPaginationAndCount(
    filter: FilterQuery<IBooking>,
    skip: number,
    limit: number,
    sort: {
      createdAt?: 1 | -1;
      totalPrice?: 1 | -1;
    }
  ): Promise<{ bookings: IBooking[]; totalCount: number }>;
  updateAfterVerfyPayment(bookingId: string): Promise<UpdateResult | null>;
  getDashboardStats(
    filter: string,
    barberId?: string
  ): Promise<{
    filter: string;
    bookings: {
      type: "bookings";
      labels: string[];
      data: number[];
      total: number;
    };
    revenue: {
      type: "revenue";
      labels: string[];
      data: number[];
      total: number;
    };
    services: {
      type: "services";
      labels: string[];
      data: number[];
      total: number;
    };
  }>;
}
