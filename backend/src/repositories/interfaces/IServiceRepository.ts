import { DeleteResult } from "mongoose";
import { IService } from "../../models/service.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IServiceRepository extends IBaseRepository<IService>{
    findAllServices(search: string,page: number,limit: number): Promise<{ services: IService[]; totalCount: number }>
    deleteService(serviceId: string): Promise<DeleteResult| null>
}