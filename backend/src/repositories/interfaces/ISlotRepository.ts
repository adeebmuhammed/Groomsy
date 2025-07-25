import { ISlot } from "../../models/slots.model";
import { IBaseRepository } from "./IBaseRepository";

export interface ISlotRepository extends IBaseRepository<ISlot>{
    findByBarber(barberId: string):Promise<ISlot[]>;
    findSimilarSlot(barberId: string,startTime: Date, endTime: Date, date: Date):Promise<ISlot | null>;
}