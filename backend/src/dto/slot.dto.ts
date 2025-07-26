export class SlotCreateRequestDto {
    startTime!: Date;
    endTime!: Date;
    price!: number;
    date!: Date;
}

export class SlotReponseDto{
    id!: string;
    startTime!: Date;
    endTime!: Date;
    price!: number;
    date!: Date;
}

export class SlotUpdateRequestDto {
    startTime!: Date;
    endTime!: Date;
    price!: number;
    date!: Date;
    barber!: string;
}

export class MessageResponseDto {
  message!: string;
}

export interface SlotListResponseDto {
  data: SlotReponseDto[];
  message: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
