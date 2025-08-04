import { DeleteResult } from "mongoose";
import { IOffer } from "../../models/offer.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IOfferRepository extends IBaseRepository<IOffer>{
    findAllOffers(search: string,page: number,limit: number): Promise<{ offers: IOffer[]; totalCount: number }>
    findByName(name:string): Promise<IOffer | null>;
    deleteOffer(offerId: string): Promise<DeleteResult| null>
}