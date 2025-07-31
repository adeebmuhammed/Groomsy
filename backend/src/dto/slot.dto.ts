export class SlotCreateRequestDto {
    slots!: DaySlot[];
  price!: number;
  duration!: string;
}

export class SlotReponseDto{
    id!: string;
    slots!: DaySlot[];
  price!: number;
  duration!: string;
}

export class SlotUpdateRequestDto {
    slots!: DaySlot[];
  price!: number;
  duration!: string;
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

export interface DaySlot {
  day: string;
  startTime: Date;
  endTime: Date;
}