"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Couponmapper = void 0;
class Couponmapper {
    static toMessageResponse(message) {
        return { message };
    }
    static toCouponDtoArray(coupons) {
        return coupons.map(coupon => Couponmapper.toCouponResponse(coupon));
    }
    static toCouponResponse(data) {
        return {
            id: data._id.toString(),
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            name: data.name,
            code: data.code,
            maxCount: data.maxCount,
            limitAmount: data.limitAmount,
            couponAmount: data.couponAmount
        };
    }
}
exports.Couponmapper = Couponmapper;
