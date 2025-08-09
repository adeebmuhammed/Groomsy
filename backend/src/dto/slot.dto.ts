export class SlotRuleCreateRequestDto {
    slots!: DaySlot[];
}

export class SlotRuleReponseDto{
    id!: string;
    slots!: DaySlot[];
}

export class SlotRuleUpdateRequestDto {
    slots!: DaySlot[];
    barber!: string;
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
  startTime: string;
  endTime: string;
}

export interface SlotTimeDto {
  startTime: string;
  endTime: string;
}

export interface SlotResponseDto {
  [date: string]: SlotTimeDto[];
}
