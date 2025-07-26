import { SlotListResponseDto, SlotReponseDto } from "../dto/slot.dto";
import { ISlot } from "../models/slots.model";

export class SlotMapper{
    static toSlotResponse(data: any): SlotReponseDto {
    return {
      id: data._id,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      price: data.price,
      date: new Date(data.date),
    };
  }

  static toSlotDtoArray(slots: ISlot[]): SlotReponseDto[] {
    return slots.map(slot => SlotMapper.toSlotResponse(slot))
  }
}