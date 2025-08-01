export class SlotRuleCreateRequestDto {
    slots!: DaySlot[];
  price!: number;
  duration!: string;
}

export class SlotRuleReponseDto{
    id!: string;
    slots!: DaySlot[];
  price!: number;
  duration!: string;
}

export class SlotRuleUpdateRequestDto {
    slots!: DaySlot[];
  price!: number;
  duration!: string;
    barber!: string;
}

export class MessageResponseDto {
  message!: string;
}

export interface SlotRuleListResponseDto {
  data: SlotRuleReponseDto[];
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

export interface SlotTimeDto {
  startTime: Date;
  endTime: Date;
}

export interface SlotResponseDto {
  [date: string]: SlotTimeDto[];
}
