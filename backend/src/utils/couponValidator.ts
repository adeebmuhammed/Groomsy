import { CouponDto } from "../dto/coupon.dto"

export const validateCouponData = (data: CouponDto):string[] => {
    const errors = []

    if (!data.name || !data.code || !data.limitAmount || !data.couponAmount || !data.startDate || !data.endDate || !data.maxCount) {
        errors.push('Required fields: name, code, limit amount, coupon amount, start date, end date and max count')
    }

    return errors
}