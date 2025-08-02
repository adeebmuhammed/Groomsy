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