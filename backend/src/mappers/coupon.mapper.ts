import { CouponDto, CouponResponseDto, MessageResponseDto } from "../dto/coupon.dto";
import { ICoupon } from "../models/coupon.model";

export class Couponmapper{
    static toMessageResponse(message: string): MessageResponseDto {
        return { message };
      }

      static toCouponDtoArray(coupons: ICoupon[]): CouponDto[] {
          return coupons.map(coupon => Couponmapper.toCouponResponse(coupon))
        }

    static toCouponResponse(data: any): CouponResponseDto {
        return {
          id: data._id,
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