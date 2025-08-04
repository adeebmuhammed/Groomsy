export interface CreateOfferDto{
    name: string;
    startDate: Date;
    endDate: Date;
    discount: number;
}

export class MessageResponseDto {
  message!: string;
}

export interface OfferDto{
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    discount: number;
}