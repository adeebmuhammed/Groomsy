import { ListResponseDto } from "../../dto/admin.dto";
import { CreateOfferDto, OfferDto } from "../../dto/offer.dto";
import { MessageResponseDto } from "../../dto/base.dto";

export interface IOfferService{
    getAllOffers(search: string,page: number,limit: number):Promise<{response: ListResponseDto<OfferDto>}>
    create(data:CreateOfferDto):Promise<{response: MessageResponseDto}>;
    edit(offerId: string, data:CreateOfferDto):Promise<{response: MessageResponseDto}>;
    delete(offerId: string):Promise<{response: MessageResponseDto}>;
}