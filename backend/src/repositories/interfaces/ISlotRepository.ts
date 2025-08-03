import { DeleteResult } from "mongoose";
import { ISlotRule } from "../../models/slots.model";
import { IBaseRepository } from "./IBaseRepository";

export interface ISlotRepository extends IBaseRepository<ISlotRule>{
    findByBarber(barberId: string,page: number, limit: number ): Promise<{ slotRules: ISlotRule[]; totalCount: number }>
    findSimilarSlot( barberId: string,day: string): Promise<ISlotRule | null>
    deleteSlot(slotId: string): Promise< DeleteResult | null> ;
}