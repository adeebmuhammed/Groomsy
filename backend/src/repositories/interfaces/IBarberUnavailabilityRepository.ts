import { UpdateResult } from "mongoose";
import { IBarberUnavailability } from "../../models/barber.unavailablity.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IBarberUnavailabilityRepository extends IBaseRepository<IBarberUnavailability>{
    addSpecialOffDays(barberId: string, data:{date: Date,reason: string}):Promise<UpdateResult | null>
    removeSpecialOffDay(barberId: string,date: string): Promise<UpdateResult | null>
}