import { ListResponseDto } from "../dto/admin.dto";
import { CouponDto, MessageResponseDto } from "../dto/coupon.dto";
import { Couponmapper } from "../mappers/coupon.mapper";
import { ICouponRepository } from "../repositories/interfaces/ICouponRepository";
import { STATUS_CODES } from "../utils/constants";
import { validateCouponData } from "../utils/couponValidator";
import { ICouponService } from "./interfaces/ICouponService";

export class CouponService implements ICouponService{
    constructor( private _couponRepo: ICouponRepository){}

    getAllCoupons = async (page: number, limit: number): Promise<{ response: ListResponseDto<CouponDto>; status: number; }> => {
        const { totalCount,coupons } = await this._couponRepo.findAllCoupons(page,limit)

        const response: ListResponseDto<CouponDto> = {
            data: Couponmapper.toCouponDtoArray(coupons),
            message: "Coupons fetched successfully",
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit
            }
        }

        return{
            response,
            status:STATUS_CODES.OK
        }
    }

    createCoupon = async(data: CouponDto): Promise<{ response: MessageResponseDto; status: number; }> =>{
        const errors = validateCouponData(data)
        if (errors.length > 0) {
            throw new Error(errors.join(" "))
        }

        const existingCodeOrName = await this._couponRepo.findByCodeOrName(data.code,data.name)
        if (existingCodeOrName) {
            throw new Error("coupon with the code or name exists, please try again with new ones")
        }

        const newCoupon = this._couponRepo.create(data)
        if (!newCoupon) {
            throw new Error("coupon creation failed")
        }

        return{
            response: Couponmapper.toMessageResponse("coupon created successfully"),
            status: STATUS_CODES.CREATED
        }
    }

    updateCoupon = async (couponId: string,data: CouponDto): Promise<{ response: MessageResponseDto; status: number; }> => {
        const errors = validateCouponData(data)
        if (errors.length > 0) {
            throw new Error(errors.join(" "))
        }

        const existingCoupon = await this._couponRepo.findById(couponId)
        if (!existingCoupon) {
            throw new Error("coupon not found")
        }

        const updatedCoupon = await this._couponRepo.update(couponId,data)
        if (!updatedCoupon) {
            throw new Error("coupon updation failed")
        }

        return {
            response: Couponmapper.toMessageResponse("coupon updated successfully"),
            status: STATUS_CODES.OK
        }
    }

    deleteCoupon = async (couponId: string): Promise<{ response: MessageResponseDto; status: number; }> => {
        if (!couponId) {
            throw new Error("coupon id required")
        }

        const existingCoupon = await this._couponRepo.findById(couponId)
        if (!existingCoupon) {
            throw new Error("coupon not found")
        }

        const deleteCoupon = this._couponRepo.deleteCoupon(couponId)
        if (!deleteCoupon) {
            throw new Error("coupon deletion failed")
        }

        return{
            response: Couponmapper.toMessageResponse("coupon deleted successfully"),
            status: STATUS_CODES.OK
        }
    }
}