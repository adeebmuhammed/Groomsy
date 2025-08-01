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
    options?: { page?: number; limit?: number }
  ): Promise<{ slots: ISlotRule[]; totalCount: number }> {
    const condition = { barber: barberId };

    if (options?.page && options?.limit) {
      const skip = (options.page - 1) * options.limit;

      const [slots, totalCount] = await Promise.all([
        this.findWithPagination(condition, skip, options.limit),
        this.countDocuments(condition),
      ]);

      return { slots, totalCount };
    } else {
      const [slots, totalCount] = await Promise.all([
        Slots.find(condition),
        this.countDocuments(condition),
      ]);

      return { slots, totalCount };
    }
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
