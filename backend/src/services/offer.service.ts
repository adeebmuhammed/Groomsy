import { ListResponseDto } from "../dto/admin.dto";
import { CreateOfferDto, OfferDto } from "../dto/offer.dto";
import { OfferMapper } from "../mappers/offer.mapper";
import { IOfferRepository } from "../repositories/interfaces/IOfferRepository";
import { validateOfferData } from "../utils/offerValidator";
import { IOfferService } from "./interfaces/IOfferService";
import { MessageResponseDto } from "../dto/base.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import mongoose from "mongoose";

@injectable()
export class OfferService implements IOfferService {
  constructor(
    @inject(TYPES.IOfferRepository) private _offerRepo: IOfferRepository
  ) {}

  getAllOffers = async (
    search: string,
    page: number,
    limit: number
  ): Promise<{ response: ListResponseDto<OfferDto>;}> => {
    const { offers, totalCount } = await this._offerRepo.findAllOffers(
      search,
      page,
      limit
    );

    const response: ListResponseDto<OfferDto> = {
      data: OfferMapper.toOfferDtoArray(offers),
      message: "offers fetched successfully",
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    };

    return {
      response,
    };
  };

  create = async (
    data: CreateOfferDto
  ): Promise<{ response: MessageResponseDto;}> => {
    const errors = validateOfferData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    const sameName = await this._offerRepo.findByName(data.name);
    if (sameName) {
      throw new Error("Offer with same name exists");
    }

    const offers = await this._offerRepo.find({});
    if (offers.length) {
      offers.forEach((offer) => {
        const newStart = new Date(data.startDate);
        const newEnd = new Date(data.endDate);
        const existingStart = new Date(offer.startDate);
        const existingEnd = new Date(offer.endDate);

        const isOverlapping =
          (newStart >= existingStart && newStart <= existingEnd) ||
          (newEnd >= existingStart && newEnd <= existingEnd) ||
          (existingStart >= newStart && existingStart <= newEnd) ||
          (existingEnd >= newStart && existingEnd <= newEnd);

        if (isOverlapping) {
          throw new Error("An offer already exists in this date range");
        }
      });
    }

    const newOffer = await this._offerRepo.create(data);
    if (!newOffer) {
      throw new Error("offer creation failed");
    }

    return {
      response: { message: "offer created successfully" },
    };
  };

  edit = async (
    offerId: string,
    data: CreateOfferDto
  ): Promise<{ response: MessageResponseDto;}> => {
    const errors = validateOfferData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    const sameName = await this._offerRepo.findByName(data.name);
    if (
      sameName &&
      (sameName._id as mongoose.Types.ObjectId).toString() !== offerId
    ) {
      throw new Error("Offer with same name exists");
    }

    const existingOffer = await this._offerRepo.findById(offerId);
    if (!existingOffer) {
      throw new Error("Offer not found");
    }

    const offers = await this._offerRepo.find({});
    if (offers.length) {
      offers.forEach((offer) => {
        if ((offer._id as mongoose.Types.ObjectId).toString() === offerId)
          return;

        const newStart = new Date(data.startDate);
        const newEnd = new Date(data.endDate);
        const existingStart = new Date(offer.startDate);
        const existingEnd = new Date(offer.endDate);

        const isOverlapping =
          (newStart >= existingStart && newStart <= existingEnd) ||
          (newEnd >= existingStart && newEnd <= existingEnd) ||
          (existingStart >= newStart && existingStart <= newEnd) ||
          (existingEnd >= newStart && existingEnd <= newEnd);

        if (isOverlapping) {
          throw new Error("An offer already exists in this date range");
        }
      });
    }

    const updatedOffer = await this._offerRepo.update(offerId, data);
    if (!updatedOffer) {
      throw new Error("offer updation failed");
    }

    return {
      response: { message: "offer edited successfully" },
    };
  };

  delete = async (
    offerId: string
  ): Promise<{ response: MessageResponseDto;}> => {
    const offer = await this._offerRepo.findById(offerId);
    if (!offer) {
      throw new Error("offer not found");
    }

    const deletedUser = await this._offerRepo.deleteOffer(offerId);
    if (!deletedUser) {
      throw new Error("offer deletion failed");
    }

    return {
      response: { message: "offer deleted successfully" },
    };
  };
}
