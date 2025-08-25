import { FilterQuery } from "mongoose";
import { BookingCreateRequestDto } from "../../dto/booking.dto";
import { IBooking } from "../../models/booking.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IBookingRepository extends IBaseRepository<IBooking> {
    findSimilarBooking(data: BookingCreateRequestDto): Promise<IBooking | null>
    findWithPaginationAndCount(filter: FilterQuery<IBooking>,skip: number,limit: number): Promise<{ bookings: IBooking[]; totalCount: number }>
}