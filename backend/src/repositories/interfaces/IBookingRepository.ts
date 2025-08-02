import { BookingCreateRequestDto } from "../../dto/booking.dto";
import { IBooking } from "../../models/booking.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IBookingRepository extends IBaseRepository<IBooking> {
    createBooking(userId : string, data: BookingCreateRequestDto): Promise<IBooking | null>
    findSimilarBooking(data: BookingCreateRequestDto): Promise<IBooking | null>
}