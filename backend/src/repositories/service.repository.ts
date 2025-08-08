import { DeleteResult } from "mongoose";
import Service, { IService } from "../models/service.model";
import { BaseRepository } from "./base.repository";
import { IServiceRepository } from "./interfaces/IServiceRepository";

export class ServiceRepository
  extends BaseRepository<IService>
  implements IServiceRepository
{
  constructor() {
    super(Service);
  }

  async findAllServices(
    search: string,
    page: number,
    limit: number
  ): Promise<{ services: IService[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const condition = search ? { name: { $regex: search, $options: "i" } } : {};

    const [services, totalCount] = await Promise.all([
      this.findWithPagination(condition, skip, limit),
      this.countDocuments(condition),
    ]);

    return { services, totalCount };
  }

  async deleteService(serviceId: string): Promise<DeleteResult | null> {
    return Service.deleteOne({ _id: serviceId });
  }
}
