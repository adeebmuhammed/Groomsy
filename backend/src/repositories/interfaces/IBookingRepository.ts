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
    limit: number
  ): Promise<{ bookings: IBooking[]; totalCount: number }>;
  updateAfterVerfyPayment(bookingId: string): Promise<UpdateResult | null>;
  getDashboardStats(
    filter: string,
    type: "bookings" | "revenue"
  ): Promise<{
    labels: string[];
    data: number[];
    type: "bookings" | "revenue";
    filter: string;
    total?: number;
  }>;
}
