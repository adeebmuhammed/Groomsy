import { ListResponseDto } from "../dto/admin.dto";
import { CreateOfferDto, MessageResponseDto, OfferDto } from "../dto/offer.dto";
import { OfferMapper } from "../mappers/offer.mapper";
import { IOfferRepository } from "../repositories/interfaces/IOfferRepository";
import { STATUS_CODES } from "../utils/constants";
import { validateOfferData } from "../utils/offerValidator";
import { IOfferService } from "./interfaces/IOfferService";

export class OfferService implements IOfferService {
  constructor(private _offerRepo: IOfferRepository) {}

  getAllCoupons = async (
    search: string,
    page: number,
    limit: number
  ): Promise<{ response: ListResponseDto<OfferDto>; status: number }> => {
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
      status: STATUS_CODES.OK,
    };
  };

  create = async (
    data: CreateOfferDto
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const errors = validateOfferData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    const sameName = await this._offerRepo.findByName(data.name);
    if (sameName) {
      throw new Error("Offer with same name exists");
    }

    const newOffer = await this._offerRepo.create(data);
    if (!newOffer) {
      throw new Error("offer creation failed");
    }

    return {
      response: { message: "offer created successfully" },
      status: STATUS_CODES.OK,
    };
  };

  edit = async (
    offerId: string,
    data: CreateOfferDto
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const errors = validateOfferData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    const sameName = await this._offerRepo.findByName(data.name);
    if (sameName) {
      throw new Error("Offer with same name exists");
    }

    const existingOffer = await this._offerRepo.findById(offerId);
    if (!existingOffer) {
      throw new Error("offer not found");
    }

    const updatedOffer = await this._offerRepo.update(offerId, data);
    if (!updatedOffer) {
      throw new Error("offer updation failed");
    }

    return {
      response: { message: "offer edited successfully" },
      status: STATUS_CODES.OK,
    };
  };

  delete = async (
    offerId: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
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
      status: STATUS_CODES.OK,
    };
  };
}
