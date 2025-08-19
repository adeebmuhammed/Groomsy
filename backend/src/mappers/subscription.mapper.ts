import mongoose from "mongoose";
import { SubscriptionDto } from "../dto/subscription.dto";
import { ISubscription } from "../models/subscription.model";

export class SubscriptionMapper{
    static toSuscriptionResponse(data: ISubscription): SubscriptionDto {
        return {
          id: (data._id as mongoose.Types.ObjectId).toString(),
          barber: (data.barber as mongoose.Types.ObjectId).toString(),
          plan: (data.plan as mongoose.Types.ObjectId).toString(),
          expiryDate: data.expiryDate,
          status: data.status,
          razorpayOrderId: data.razorpayOrderId
        };
      }
}