import { ListResponseDto } from "../../dto/admin.dto";
import { MessageResponseDto } from "../../dto/base.dto";
import { CreateServiceDto, ServiceResponseDto } from "../../dto/service.dto";

export interface IServiceService{
    fetch(search: string,page: number,limit: number): Promise<{ response: ListResponseDto<ServiceResponseDto>, status: number}>
    create(data: CreateServiceDto):Promise<{ response: MessageResponseDto, status: number}>
    edit(serviceId:string, data: CreateServiceDto):Promise<{ response: MessageResponseDto, status: number}>
    delete(serviceId:string):Promise<{ response: MessageResponseDto, status: number}>
}