export interface IBarber {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  status: 'active' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  message?: string;
  pagination: Pagination;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'blocked';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminLoginResponse {
  id: string;
  name: string;
  email: string;
  message: string;
}

export interface IMessageResponse {
  message: string;
}

export interface IUserLoginResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  message: string;
}

export interface IBarberLoginResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  district: string;
  status: string;
  message: string;
}

export interface IVerifyOtpResponse {
  message: string;
  barber: {
    name: string;
    email: string;
  };
}

export interface IResendOtpResponse {
  message: string;
  user: {
    name: string;
  };
}

export interface SlotDto {
  id: string;
  slots: DaySlot[];
  price: number;
  duration: string;
}

export interface DaySlot {
  day: string;
  startTime: Date;
  endTime: Date;
}

export interface SlotListResponseDto {
  data: SlotDto[];
  message: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
export interface BarberDto {
  id: string;
  name: string;
  email: string;
  district: string;
  status: string;
}
export interface CouponResponseDto {
  id: string;
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  maxCount: number;
  limitAmount: number;
  couponAmount: number;
}

export interface CouponListResponseDto {
  data: CouponResponseDto[];
  message: string;
  pagination: Pagination;
}

export class CouponRequestDto {
  name!: string;
  code!: string;
  startDate!: Date;
  endDate!: Date;
  maxCount!: number;
  limitAmount!: number;
  couponAmount!: number;
}

export interface SlotTime {
  startTime: Date;
  endTime: Date;
  isBooked?: boolean; // ✅ new
}

export class SlotResponse {
  [date: string]: SlotTime[];
}

export class BookingCreateRequestDto {
  barberId!: string;
  serviceId!: string;
  date!: Date;
  startTime!: Date;
  endTime!: Date;
  price!: number;
}

export class BookingResponseDto {
  id!: string;
  user!: string;
  barber!: string;
  totalPrice!: number;
  finalPrice!: number;         // ✅ new
  discountAmount!: number;     // ✅ new
  couponCode?: string;         // ✅ new
  service!: string;
  status!:
    | 'staged'
    | 'pending'
    | 'cancelled_by_barber'
    | 'cancelled_by_user'
    | 'finished';
  slotDetails!: {
    startTime: Date;
    endTime: Date;
    date: Date;
  };
}


export interface OfferRequestDto {
  name: string;
  startDate: Date;
  endDate: Date;
  discount: number;
}

export interface OfferResponseDto {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  discount: number;
}

export interface OfferListResponseDto {
  data: OfferResponseDto[];
  message: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface BarberUnavailabilityDto {
  id: string;
  barber: string;
  weeklyOff: string;
  specialOffDays: { date: string; reason?: string }[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ServiceListResponse {
  data: Service[];
  message?: string;
  pagination: Pagination;
}

export interface confirmData {
  finalPrice?: number;
  couponCode?: string;
  discountAmount?: number;
}


export interface confirmBookingDto {
  message: string;
  orderId: string;
  amount: string | number;
  currency: string;
  bookingId: string;
  keyId: string;
}

export interface ReviewCreateRequestDto{
    reviewText : string,
    rating : number
}

export interface ReviewResponseDto {
  id: string;
  booking: string;
  barber: string;
  rating: number;
  reviewText: string;
}

export interface ReviewListResponse {
  data: ReviewResponseDto[];
  message?: string;
  pagination: Pagination;
}

export interface SubscriptionPlanDto{
    id: string;
    name: string;
  price: number;
  renewalPrice: number;
  duration: number;
  durationUnit: "month" | "year" | "day";
  description?: string;
  isActive: boolean;
}

export interface PlanListResponse{
  data: SubscriptionPlanDto[];
  message?: string;
  pagination: Pagination;
}

export interface CreateSubscriptionPlanDto{
    name: string;
  price: number;
  renewalPrice: number;
  duration: number;
  durationUnit: "month" | "year" | "day";
  description?: string;
}

export interface CreateSubscriptionPlanDto{
    name: string;
  price: number;
  renewalPrice: number;
  duration: number;
  durationUnit: "month" | "year" | "day";
  description?: string;
}