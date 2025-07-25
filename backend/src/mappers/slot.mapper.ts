import { SlotReponseDto } from "../dto/slot.dto";

export class SlotMapper{
    static toSlotResponse(data: any): SlotReponseDto {
    return {
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      price: data.price,
      date: new Date(data.date),
    };
  }
}