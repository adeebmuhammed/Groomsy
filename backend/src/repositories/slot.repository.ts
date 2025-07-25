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

    async findByBarber(barberId: string): Promise<ISlot[]> {
        return await Slots.find({ barber: barberId})
    }

    async findSimilarSlot(barberId: string, startTime: Date, endTime: Date, date: Date): Promise<ISlot | null> {
        return await Slots.findOne({barber:barberId,startTime,endTime,date})
    }

    async deleteSlot(slotId: string):Promise<DeleteResult>{
        return await Slots.deleteOne({_id:slotId})
    }
}