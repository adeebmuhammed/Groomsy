import {
  BookingCreateRequestDto,
  BookingResponseDto,
  confirmBookingDto,
} from "../../dto/booking.dto";
import { MessageResponseDto } from "../../dto/base.dto";
import { ROLES } from "../../utils/constants";

export interface IBookingService {
  fetchBookings(
    role: string,
    id: string | undefined,
    page: number,
    limit: number
  ): Promise<{
    response: { data: BookingResponseDto[]; totalCount: number };
  }>;
  stageBooking(
    userId: string,
    data: BookingCreateRequestDto
  ): Promise<{ response: BookingResponseDto;}>;
  couponApplication(
    bookingId: string,
    couponCode: string
  ): Promise<{ response: BookingResponseDto;}>;
  confirmBooking(
    bookingId: string,
    userId: string,
    data: { finalPrice?: number; couponCode?: string; discountAmount?: number }
  ): Promise<{ response: confirmBookingDto;}>;
  verifyPayment(
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
    bookingId: string
  ): Promise<{ response: MessageResponseDto;}>;
  updateBookingStatus(
    role: ROLES,
    bookingId: string,
    bookingStatus: string
  ): Promise<{ response: MessageResponseDto;}>;
  getBookingById(
    bookingId: string
  ): Promise<{ response: BookingResponseDto;}>;
  getBookingsByStatus(
    status: "pending" | "staged" | "cancelled" | "finished",
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    response: { data: BookingResponseDto[]; totalCount: number };
  }>;
}
