export class SlotCreateRequestDto {
    startTime!: Date;
    endTime!: Date;
    price!: number;
    date!: Date;
}

export class SlotReponseDto{
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