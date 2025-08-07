export class CouponDto{
    name!: string;
    code!: string;
    startDate!: Date;
    endDate!: Date;
    maxCount!: number;
    limitAmount!: number;
    couponAmount!: number;
}


export class CouponResponseDto{
    id!:string;
    name!: string;
    code!: string;
    startDate!: Date;
    endDate!: Date;
    maxCount!: number;
    limitAmount!: number;
    couponAmount!: number;
}