import { IBaseRepository } from "./IBaseRepository";
import { IUser } from "../../models/user.model";

export interface IUserRepository extends IBaseRepository<IUser>{
    findByEmail(email: string): Promise<IUser | null>;
    findBySearchTerm(search: string, page: number, limit: number): Promise<{users : IUser[]; totalCount: number }>;
}