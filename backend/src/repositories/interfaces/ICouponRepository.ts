import { DeleteResult } from "mongoose";
import { ICoupon } from "../../models/coupon.model";
import { IBaseRepository } from "./IBaseRepository";

export interface ICouponRepository extends IBaseRepository<ICoupon>{
    findByCodeOrName(code: string, name: string):Promise<ICoupon | null>;
    deleteCoupon(couponId: string):Promise<DeleteResult>;
    findAllCoupons(page: number,limit: number): Promise<{ coupons: ICoupon[]; totalCount: number }>
}