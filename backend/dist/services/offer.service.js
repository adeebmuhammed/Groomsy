"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferService = void 0;
const offer_mapper_1 = require("../mappers/offer.mapper");
const offerValidator_1 = require("../utils/offerValidator");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let OfferService = class OfferService {
    constructor(_offerRepo) {
        this._offerRepo = _offerRepo;
        this.getAllOffers = async (search, page, limit) => {
            const { offers, totalCount } = await this._offerRepo.findAllOffers(search, page, limit);
            const response = {
                data: offer_mapper_1.OfferMapper.toOfferDtoArray(offers),
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
        this.create = async (data) => {
            const errors = (0, offerValidator_1.validateOfferData)(data);
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
                    const isOverlapping = (newStart >= existingStart && newStart <= existingEnd) ||
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
        this.edit = async (offerId, data) => {
            const errors = (0, offerValidator_1.validateOfferData)(data);
            if (errors.length > 0) {
                throw new Error(errors.join(" "));
            }
            const sameName = await this._offerRepo.findByName(data.name);
            if (sameName &&
                sameName._id.toString() !== offerId) {
                throw new Error("Offer with same name exists");
            }
            const existingOffer = await this._offerRepo.findById(offerId);
            if (!existingOffer) {
                throw new Error("Offer not found");
            }
            const offers = await this._offerRepo.find({});
            if (offers.length) {
                offers.forEach((offer) => {
                    if (offer._id.toString() === offerId)
                        return;
                    const newStart = new Date(data.startDate);
                    const newEnd = new Date(data.endDate);
                    const existingStart = new Date(offer.startDate);
                    const existingEnd = new Date(offer.endDate);
                    const isOverlapping = (newStart >= existingStart && newStart <= existingEnd) ||
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
        this.delete = async (offerId) => {
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
};
exports.OfferService = OfferService;
exports.OfferService = OfferService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IOfferRepository)),
    __metadata("design:paramtypes", [Object])
], OfferService);
