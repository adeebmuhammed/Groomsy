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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferRepository = void 0;
const offer_model_1 = __importDefault(require("../models/offer.model"));
const base_repository_1 = require("./base.repository");
const inversify_1 = require("inversify");
let OfferRepository = class OfferRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(offer_model_1.default);
    }
    async findByName(name) {
        return await offer_model_1.default.findOne({ name });
    }
    async deleteOffer(offerId) {
        return await offer_model_1.default.deleteOne({ _id: offerId });
    }
    async findAllOffers(search, page, limit) {
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
};
exports.OfferRepository = OfferRepository;
exports.OfferRepository = OfferRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], OfferRepository);
