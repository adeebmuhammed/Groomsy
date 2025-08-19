import { describe } from "node:test";
import SubscriptionPlan, {
  ISubscriptionPlan,
} from "../models/subscription.plans.model";
import { BaseRepository } from "./base.repository";
import { ISubscriptionPlanRepository } from "./interfaces/ISubsciptionPlanRepository";

export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlan>
  implements ISubscriptionPlanRepository
{
  constructor() {
    super(SubscriptionPlan);
  }

  async findBySearchTerm(
    search: string,
    page: number,
    limit: number
  ): Promise<{ plans: ISubscriptionPlan[]; totalCount: number }> {
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;

    const [plans, totalCount] = await Promise.all([
      SubscriptionPlan.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      SubscriptionPlan.countDocuments(query),
    ]);

    return { plans, totalCount };
  }
}
