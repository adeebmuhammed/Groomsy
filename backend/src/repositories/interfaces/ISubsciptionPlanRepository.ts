import { ISubscriptionPlan } from "../../models/subscription.plans.model";
import { IBaseRepository } from "./IBaseRepository";

export interface ISubscriptionPlanRepository extends IBaseRepository<ISubscriptionPlan>{
    findBySearchTerm(search: string,page: number,limit: number): Promise<{ plans: ISubscriptionPlan[]; totalCount: number }>
}