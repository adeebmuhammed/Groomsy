import { BookingCreateRequestDto, MessageResponseDto } from "../../dto/booking.dto";

export interface IBookingService{
    createBooking(userId: string, data: BookingCreateRequestDto):Promise<{response: MessageResponseDto, status: number}>;
    updateBookingStatus( role: "user" | "barber", bookingId: string, bookingStatus: string):Promise<{response: MessageResponseDto, status: number}>;
}