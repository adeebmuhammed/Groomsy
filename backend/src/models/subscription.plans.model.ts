import mongoose, { Schema,Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string;
  price: number;
  renewalPrice: number;
  duration: number;
  durationUnit: "month" | "year" | "day";
  description?: string;
  isActive: boolean;
}

const SubscriptionPlanSchema: Schema<ISubscriptionPlan> = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    renewalPrice: { type: Number, required: true },
    duration: { type: Number, required: true },
    durationUnit: { type: String, enum: [ "month" , "year" , "day" ], required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true }
},{ timestamps: true });

const SubscriptionPlan = mongoose.model("SubscriptionPlan",SubscriptionPlanSchema)
export default SubscriptionPlan;