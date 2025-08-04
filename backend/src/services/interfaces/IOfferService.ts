import { ListResponseDto } from "../../dto/admin.dto";
import { CreateOfferDto, MessageResponseDto, OfferDto } from "../../dto/offer.dto";

export interface IOfferService{
    getAllCoupons(search: string,page: number,limit: number):Promise<{response: ListResponseDto<OfferDto>, status: number}>
    create(data:CreateOfferDto):Promise<{response: MessageResponseDto, status: number}>;
    edit(offerId: string, data:CreateOfferDto):Promise<{response: MessageResponseDto, status: number}>;
    delete(offerId: string):Promise<{response: MessageResponseDto, status: number}>;
}