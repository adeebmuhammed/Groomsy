import { DeleteResult } from "mongoose";
import Slots, { ISlot } from "../models/slots.model";
import { BaseRepository } from "./base.repository";
import { ISlotRepository } from "./interfaces/ISlotRepository";

export class SlotRepository
extends BaseRepository<ISlot>
 implements ISlotRepository{

    constructor(){
        super(Slots)
    }

    async findByBarber(
  barberId: string,
  page: number,
  limit: number
): Promise<{ slots: ISlot[]; totalCount: number }> {
  const skip = (page - 1) * limit;

  const condition = { barber: barberId };
  const [slots, totalCount] = await Promise.all([
    this.findWithPagination(condition, skip, limit),
    this.countDocuments(condition)
  ]);

  return { slots, totalCount };
}


    async findSimilarSlot(barberId: string, startTime: Date, endTime: Date, date: Date): Promise<ISlot | null> {
        return await Slots.findOne({barber:barberId,startTime,endTime,date})
    }

    async deleteSlot(slotId: string):Promise<DeleteResult>{
        return await Slots.deleteOne({_id:slotId})
    }
}