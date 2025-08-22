import { DeleteResult } from "mongoose";
import Offers, { IOffer } from "../models/offer.model";
import { BaseRepository } from "./base.repository";
import { IOfferRepository } from "./interfaces/IOfferRepository";
import { injectable } from "inversify";

@injectable()
export class OfferRepository
  extends BaseRepository<IOffer>
  implements IOfferRepository
{
  constructor() {
    super(Offers);
  }

  async findByName(name: string): Promise<IOffer | null> {
    return await Offers.findOne({ name });
  }

  async deleteOffer(offerId: string): Promise<DeleteResult> {
    return await Offers.deleteOne({ _id: offerId });
  }

  async findAllOffers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ offers: IOffer[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const condition = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const [offers, totalCount] = await Promise.all([
      this.findWithPagination(condition, skip, limit),
      this.countDocuments(condition),
    ]);

    return { offers, totalCount };
  }
}
