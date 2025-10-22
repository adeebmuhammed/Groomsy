import { CouponDto } from "../dto/coupon.dto"

export const validateCouponData = (data: CouponDto):string[] => {
    const errors = []

    if (!data.name || !data.code || !data.limitAmount || !data.couponAmount || !data.startDate || !data.endDate || !data.maxCount) {
        errors.push('Required fields: name, code, limit amount, coupon amount, start date, end date and max count')
    }

    if (data.startDate && data.endDate) {
        if (data.startDate >= data.endDate) {
            errors.push("Start date should be less than end date");
        }
    }

    if (data.limitAmount != null && data.limitAmount <= 0) {
        errors.push("Limit Amount should be a valid number greater than zero");
    }

    if(data.couponAmount != null && data.couponAmount <= 0){
        errors.push("Coupon Amount should be a valid number greater than zero");
    }

    if (data.maxCount != null && data.maxCount <= 0) {
        errors.push("Max count should be a valid number greater than zero")
    }

    return errors
}