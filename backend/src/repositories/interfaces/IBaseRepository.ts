import { FilterQuery } from "mongoose";

export interface IBaseRepository<T>{
    create(data:Partial<T>):Promise<T>;
    findById(id: string): Promise<T | null>;
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    find(filter: FilterQuery<T>): Promise<T[]>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    countDocuments(filter: FilterQuery<T>): Promise<number>;
    findWithPagination(
        condition: FilterQuery<T>,
        skip: number,
        limit: number
    ): Promise<T[]>;
}