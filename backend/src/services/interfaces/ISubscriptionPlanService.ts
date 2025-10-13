import { ListResponseDto } from "../../dto/admin.dto";
import { MessageResponseDto } from "../../dto/base.dto";
import { CreateSubscriptionPlanDto, SubscriptionPlanDto } from "../../dto/subscription.plan.dto";

export interface ISubscriptionPlanService{
    getSubscriptionPlans( search: string, page: number, limit: number ): Promise<{ response: ListResponseDto<SubscriptionPlanDto>}>
    create ( data: CreateSubscriptionPlanDto): Promise<{ response: MessageResponseDto }>
    updateActivation( planId: string): Promise<{ response: MessageResponseDto }>
    getPlansForBarber():Promise<{ response: SubscriptionPlanDto[] }>
    getPlanById(planId: string) :Promise<{ planData: SubscriptionPlanDto}>
}