import { inject, injectable } from "inversify";
import { ListResponseDto } from "../dto/admin.dto";
import { MessageResponseDto } from "../dto/base.dto";
import { CreateServiceDto, ServiceResponseDto } from "../dto/service.dto";
import { ServiceMapper } from "../mappers/service.mapper";
import { IServiceRepository } from "../repositories/interfaces/IServiceRepository";
import { STATUS_CODES } from "../utils/constants";
import { IServiceService } from "./interfaces/IServiceService";
import { TYPES } from "../config/types";

@injectable()
export class ServiceService implements IServiceService{
    constructor(@inject(TYPES.IServiceRepository) private _serviceRepo: IServiceRepository){}

    fetch = async (search: string, page: number, limit: number): Promise<{ response: ListResponseDto<ServiceResponseDto>;}> =>{
        const { services,totalCount} = await this._serviceRepo.findAllServices(search,page,limit)

        const response: ListResponseDto<ServiceResponseDto> = {
            data : ServiceMapper.toServiceDtoArray(services),
            message: "services fetched successfully",
            pagination: {
                currentPage: page,
                itemsPerPage: limit,
                totalItems: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        }

        return {
            response,
        }
    }

    create = async (data: CreateServiceDto): Promise<{ response: MessageResponseDto; }> => {
        if (!data.name || !data.description || !data.duration || !data.price) {
            throw new Error("Required field : Name, Description, Duration and Price")
        }

        const existinng = await this._serviceRepo.findOne({name:data.name})
        if (existinng) {
            throw new Error("service with the same name exists")
        }

        const duration = ["15m", "30m", "45m", "60m", "75m", "90m", "105m", "120m"]
        if (!duration.includes(data.duration)) {
            throw new Error("invalid duration type")
        }

        const newService = await this._serviceRepo.create(data)
        if (!newService) {
            throw new Error("service creation failed")
        }

        return{
            response: {message: "service created successfully"}
        }
    }

    edit = async (serviceId: string,data: CreateServiceDto): Promise<{ response: MessageResponseDto;}> => {
        if (!data.name || !data.description || !data.duration || !data.price) {
            throw new Error("Required field : Name, Description, Duration and Price")
        }

        const existinng = await this._serviceRepo.findById(serviceId)
        if (!existinng) {
            throw new Error("service not found")
        }

        const duration = ["15m", "30m", "45m", "60m", "75m", "90m", "105m", "120m"]
        if (!duration.includes(data.duration)) {
            throw new Error("invalid duration type")
        }

        const updated = await this._serviceRepo.update(serviceId,data)
        if (!updated) {
            throw new Error("service editing failed")
        }

        return{
            response: {message: "service edited successfully"},
        }
    }

    delete = async (serviceId: string): Promise<{ response: MessageResponseDto;}>=> {
        const service = await this._serviceRepo.findById(serviceId)
        if (!service) {
            throw new Error("service not found")
        }

        const deleted = await this._serviceRepo.deleteService(serviceId)
        if (!deleted) {
            throw new Error("deleting service failed")
        }

        return{
            response: { message: "service deleted succefully" }
        }
    }

    getServiceById = async (serviceId: string): Promise<{ response: ServiceResponseDto;}> => {
        const service = await this._serviceRepo.findById(serviceId)
        if (!service) {
            throw new Error("service not found")
        }

        return{
            response : ServiceMapper.toServiceResponse(service)
        }
    }
}