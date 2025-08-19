import mongoose from "mongoose";
import { SubscriptionPlanDto } from "../dto/subscription.plan.dto";
import { ISubscriptionPlan } from "../models/subscription.plans.model";

export class PlanMapper {
  static toPlanResponse(data: ISubscriptionPlan): SubscriptionPlanDto {
    return {
      id: (data._id as mongoose.Types.ObjectId).toString(),
      name: data.name,
      price: data.price,
      renewalPrice: data.renewalPrice,
      description: data.description,
      duration: data.duration,
      durationUnit: data.durationUnit,
      isActive: data.isActive,
    };
  }
  static toPlanResponseArray(
    plans: ISubscriptionPlan[]
  ): SubscriptionPlanDto[] {
    return plans.map((plan) => PlanMapper.toPlanResponse(plan));
  }
}
