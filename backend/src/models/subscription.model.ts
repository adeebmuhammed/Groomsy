import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
  plan: mongoose.Types.ObjectId;
  barber: mongoose.Types.ObjectId;
  expiryDate: Date;
  status: "active" | "pending";
  razorpayOrderId?: string;
}

const SubscriptionSchema: Schema = new Schema(
  {
    plan: {
      type: mongoose.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    barber: { type: mongoose.Types.ObjectId, ref: "Barber", required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum:["active","pending"], required: true },
    razorpayOrderId: { type: String, required: true },
  },
  { timestamps: true }
);

const Subscription = mongoose.model<ISubscription>("Subscription",SubscriptionSchema);
export default Subscription;