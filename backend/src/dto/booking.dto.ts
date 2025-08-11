export interface BookingCreateRequestDto {
  barberId: string;
  serviceId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  price: number;
}


export interface BookingResponseDto {
  id: string;
  user: string;
  barber: string;
  service: string;
  totalPrice: number;
  finalPrice?: number; 
  discountAmount?: number;
  couponCode?: string; 
  status:
    | "staged"
    | "pending"
    | "cancelled_by_barber"
    | "cancelled_by_user"
    | "cancelled_by_admin"
    | "finished";
  slotDetails: {
    startTime: Date;
    endTime: Date;
    date: Date;
  };
}
