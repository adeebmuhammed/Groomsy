import mongoose from "mongoose";
import { CouponDto, CouponResponseDto } from "../dto/coupon.dto";
import { MessageResponseDto } from "../dto/base.dto";
import { ICoupon } from "../models/coupon.model";

export class Couponmapper{
    static toMessageResponse(message: string): MessageResponseDto {
        return { message };
      }

      static toCouponDtoArray(coupons: ICoupon[]): CouponDto[] {
          return coupons.map(coupon => Couponmapper.toCouponResponse(coupon))
        }

    static toCouponResponse(data: ICoupon): CouponResponseDto {
        return {
          id: (data._id as mongoose.Types.ObjectId).toString(),
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