import { DeleteResult } from "mongoose";
import { ISlotRule } from "../../models/slots.model";
import { IBaseRepository } from "./IBaseRepository";

export interface ISlotRepository extends IBaseRepository<ISlotRule>{
    findByBarber(barberId: string,page: number,limit: number):Promise<{slots :ISlotRule[]; totalCount: number}>;
    findSimilarSlot( barberId: string,startTime: Date,endTime: Date,day: string): Promise<ISlotRule | null>
    deleteSlot(slotId: string): Promise< DeleteResult | null> ;
}