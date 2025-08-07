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
  status: string
}
export interface CouponResponseDto{
    id:string;
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
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export class CouponRequestDto{
    name!: string;
    code!: string;
    startDate!: Date;
    endDate!: Date;
    maxCount!: number;
    limitAmount!: number;
    couponAmount!: number;
}

export class SlotTime {
  startTime!: Date;
  endTime!: Date;
  price!: number;
}

export class SlotResponse {
  [date: string]: SlotTime[];
}


export class BookingCreateRequestDto {
    barberId!: string
    date!: Date
    startTime!: Date
    endTime!: Date
    price!: number
}

export class BookingResponseDto {
  id!: string;
  user!: string;
  barber!: string;
  totalPrice!: number;
  status!: "pending" | "cancelled_by_barber" | "cancelled_by_user" | "finished";
  slotDetails!: {
    startTime: Date;
    endTime: Date;
    date: Date;
  };
}

export interface OfferRequestDto{
    name: string;
    startDate: Date;
    endDate: Date;
    discount: number;
}

export interface OfferResponseDto{
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