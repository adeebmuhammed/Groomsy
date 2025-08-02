import { DeleteResult } from "mongoose";
import Slots, { ISlotRule } from "../models/slots.model";
import { BaseRepository } from "./base.repository";
import { ISlotRepository } from "./interfaces/ISlotRepository";

export class SlotRepository
  extends BaseRepository<ISlotRule>
  implements ISlotRepository
{
  constructor() {
    super(Slots);
  }

  async findByBarber(
    barberId: string,
    page: number,
    limit: number
  ): Promise<{ slotRules: ISlotRule[]; totalCount: number }> {
    const condition = { barber: barberId };

    const skip = (page - 1) * limit;

    const [slotRules, totalCount] = await Promise.all([
      this.findWithPagination(condition, skip, limit),
      this.countDocuments(condition),
    ]);

    return { slotRules, totalCount };
  }
  
  async findSimilarSlot(
    barberId: string,
    startTime: Date,
    endTime: Date,
    day: string
  ): Promise<ISlotRule | null> {
    return await Slots.findOne({
      barber: barberId,
      slots: {
        $elemMatch: {
          day: day,
          startTime: startTime,
          endTime: endTime,
        },
      },
    });
  }

  async deleteSlot(slotId: string): Promise<DeleteResult> {
    return await Slots.deleteOne({ _id: slotId });
  }
}
