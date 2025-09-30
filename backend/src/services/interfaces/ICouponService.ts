import { ListResponseDto } from "../../dto/admin.dto";
import { CouponDto } from "../../dto/coupon.dto";
import { MessageResponseDto } from "../../dto/base.dto";

export interface ICouponService {
    getAllCoupons(search: string,page: number,limit: number):Promise<{response: ListResponseDto<CouponDto>,}>
    createCoupon(data: CouponDto):Promise<{response: MessageResponseDto,}>
    updateCoupon(couponId: string,data: CouponDto):Promise<{response: MessageResponseDto,}>
    deleteCoupon(couponId: string):Promise<{response: MessageResponseDto,}>
}