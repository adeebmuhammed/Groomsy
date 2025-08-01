import mongoose from "mongoose";
import { DaySlot, SlotRuleListResponseDto, SlotRuleReponseDto } from "../dto/slot.dto";
import { ISlotRule } from "../models/slots.model";

export class SlotMapper{
    static toSlotResponse(data: ISlotRule): SlotRuleReponseDto {
    return {
      id: (data._id as mongoose.Types.ObjectId).toString(),
    price: data.price,
    duration: data.duration,
    slots: data.slots.map((slot: DaySlot) => ({
      day: slot.day,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime)
    }))
    };
  }

  static toSlotDtoArray(slots: ISlotRule[]): SlotRuleReponseDto[] {
    return slots.map(slot => SlotMapper.toSlotResponse(slot))
  }
}