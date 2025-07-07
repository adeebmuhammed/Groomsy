import { IBarber } from "../../models/barber.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IBarberRepository extends IBaseRepository<IBarber>{
    findByEmail( email: string): Promise< IBarber | null>;
}