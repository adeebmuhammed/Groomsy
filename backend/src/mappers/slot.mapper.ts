import mongoose from "mongoose";
import { DaySlot, SlotRuleReponseDto } from "../dto/slot.dto";
import { ISlotRule } from "../models/slots.model";

export class SlotMapper{
    static toSlotResponse(data: ISlotRule): SlotRuleReponseDto {
    return {
      id: (data._id as mongoose.Types.ObjectId).toString(),
    slots: data.slots.map((slot: DaySlot) => ({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime
    }))
    };
  }

  static toSlotDtoArray(slots: ISlotRule[]): SlotRuleReponseDto[] {
    return slots.map(slot => SlotMapper.toSlotResponse(slot))
  }
}