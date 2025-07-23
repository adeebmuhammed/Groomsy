import { IBarber } from "../../models/barber.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IBarberRepository extends IBaseRepository<IBarber>{
    findByEmail( email: string): Promise< IBarber | null>;
    findBySearchTerm(search: string, page: number, limit: number): Promise<{barbers : IBarber[]; totalCount: number }>;
}