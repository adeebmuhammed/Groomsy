export interface BookingCreateRequestDto {
    barberId: string
    date: Date
    startTime: Date
    endTime: Date
    price: number
}

export class MessageResponseDto {
  message!: string;
}

export interface BookingResponseDto {
  id: string;
  user: string;
  barber: string;
  totalPrice: number;
  status: "pending" | "cancelled_by_barber" | "cancelled_by_user" | "cancelled_by_admin" | "finished";
  slotDetails: {
    startTime: Date;
    endTime: Date;
    date: Date;
  };
}
