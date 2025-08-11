import { BookingCreateRequestDto, BookingResponseDto } from "../../dto/booking.dto";
import { MessageResponseDto } from "../../dto/base.dto";

export interface IBookingService{
    fetchBookings(role: string, id: string | undefined, page: number, limit: number):Promise<{response: {data: BookingResponseDto[],totalCount: number}, status:number}>;
    stageBooking(userId: string, data: BookingCreateRequestDto):Promise<{response: BookingResponseDto, status: number}>;
    couponApplication(bookingId: string, couponCode: string):Promise<{response: BookingResponseDto, status: number}>;
    confirmBooking(bookingId: string,userId: string,data: {finalPrice?: number;couponCode?: string;discountAmount?: number;}): Promise<{ response: MessageResponseDto; status: number }>
    updateBookingStatus( role: "user" | "barber", bookingId: string, bookingStatus: string):Promise<{response: MessageResponseDto, status: number}>;
}