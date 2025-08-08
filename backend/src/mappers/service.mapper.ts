import mongoose from "mongoose";
import { ServiceResponseDto } from "../dto/service.dto";
import { IService } from "../models/service.model";

export class ServiceMapper {
  static toServiceDtoArray(services: IService[]): ServiceResponseDto[] {
    return services.map((service) => ServiceMapper.toServiceResponse(service));
  }

  static toServiceResponse(data: IService): ServiceResponseDto {
    return {
      id: (data._id as mongoose.Types.ObjectId).toString(),
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
    };
  }
}
