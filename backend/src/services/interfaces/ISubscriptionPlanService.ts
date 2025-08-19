import { ListResponseDto } from "../../dto/admin.dto";
import { MessageResponseDto } from "../../dto/base.dto";
import { CreateSubscriptionPlanDto, SubscriptionPlanDto } from "../../dto/subscription.plan.dto";

export interface ISubscriptionPlanService{
    getSubscriptionPlans( search: string, page: number, limit: number ): Promise<{ response: ListResponseDto<SubscriptionPlanDto>, status: number}>
    create ( data: CreateSubscriptionPlanDto): Promise<{ response: MessageResponseDto, status: number }>
    updateActivation( planId: string): Promise<{ response: MessageResponseDto, status: number }>
    getPlansForBarber():Promise<{ response: SubscriptionPlanDto[], status: number }>
}