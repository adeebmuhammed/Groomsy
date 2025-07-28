import { ListResponseDto } from "../../dto/admin.dto";
import { CouponDto,MessageResponseDto } from "../../dto/coupon.dto";

export interface ICouponService {
    getAllCoupons(page: number,limit: number):Promise<{response: ListResponseDto<CouponDto>, status: number}>
    createCoupon(data: CouponDto):Promise<{response: MessageResponseDto, status: number}>
    updateCoupon(couponId: string,data: CouponDto):Promise<{response: MessageResponseDto, status: number}>
    deleteCoupon(couponId: string):Promise<{response: MessageResponseDto, status: number}>
}