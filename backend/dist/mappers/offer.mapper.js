"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferMapper = void 0;
class OfferMapper {
    static toOfferDtoArray(offers) {
        return offers.map((offer) => OfferMapper.toOfferResponse(offer));
    }
    static toOfferResponse(data) {
        return {
            id: data._id.toString(),
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            name: data.name,
            discount: data.discount,
        };
    }
}
exports.OfferMapper = OfferMapper;
