import { BookingCreateRequestDto, BookingResponseDto, MessageResponseDto } from "../../dto/booking.dto";

export interface IBookingService{
    fetchBookings(role: string, id: string | undefined, page: number, limit: number):Promise<{response: {data: BookingResponseDto[],totalCount: number}, status:number}>;
    createBooking(userId: string, data: BookingCreateRequestDto):Promise<{response: MessageResponseDto, status: number}>;
    updateBookingStatus( role: "user" | "barber"| "admin" , bookingId: string, bookingStatus: string):Promise<{response: MessageResponseDto, status: number}>;
}