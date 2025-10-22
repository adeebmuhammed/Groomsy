import mongoose from "mongoose";
import { OfferDto } from "../dto/offer.dto";
import { IOffer } from "../models/offer.model";

export class OfferMapper {
  static toOfferDtoArray(offers: IOffer[]): OfferDto[] {
    return offers.map((offer) => OfferMapper.toOfferResponse(offer));
  }

  static toOfferResponse(data: IOffer): OfferDto {
    return {
      id: (data._id as mongoose.Types.ObjectId).toString(),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      name: data.name,
      discount: data.discount,
    };
  }
}
