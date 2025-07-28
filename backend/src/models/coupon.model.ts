import mongoose,{Document,Schema} from "mongoose";

export interface ICoupon extends Document{
    name: string;
    code: string;
    startDate: Date;
    endDate: Date;
    usedCount: number;
    maxCount: number;
    limitAmount: number;
    couponAmount: number;
}

const CouponSchema : Schema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    code : { type: String, required: true, unique: true},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usedCount: { type: Number, default: 0 },
    maxCount: { type: Number, required: true },
    limitAmount: { type: Number, required: true},
    couponAmount: { type: Number, required: true}
})

const Coupons = mongoose.model<ICoupon>("Coupons",CouponSchema)
export default Coupons;