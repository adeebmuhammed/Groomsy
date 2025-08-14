import { ListResponseDto } from "../dto/admin.dto";
import { MessageResponseDto } from "../dto/base.dto";
import {
  CreateSubscriptionPlanDto,
  SubscriptionPlanDto,
} from "../dto/subscription.plan.dto";
import { PlanMapper } from "../mappers/subscription.plan.mapper";
import { ISubscriptionPlanRepository } from "../repositories/interfaces/ISubsciptionPlanRepository";
import { STATUS_CODES } from "../utils/constants";
import { validatePlanData } from "../utils/planValidator";
import { ISubscriptionPlanService } from "./interfaces/ISubscriptionPlanService";

export class SubscriptionPlanService implements ISubscriptionPlanService {
  constructor(private _planRepo: ISubscriptionPlanRepository) {}

  getSubscriptionPlans = async (
    search: string,
    page: number,
    limit: number
  ): Promise<{
    response: ListResponseDto<SubscriptionPlanDto>;
    status: number;
  }> => {
    const { plans, totalCount } = await this._planRepo.findBySearchTerm(
      search,
      page,
      limit
    );

    const response: ListResponseDto<SubscriptionPlanDto> = {
      data: PlanMapper.toPlanResponseArray(plans),
      message: "subscripltion plans fetched successfully",
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    };

    return{
        response,
        status: STATUS_CODES.OK
    }
  };

  create = async (
    data: CreateSubscriptionPlanDto
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const errors = validatePlanData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    const existing = await this._planRepo.findOne({
      duration: data.duration,
      durationUnit: data.durationUnit,
    });
    if (existing) {
      throw new Error("plan exists with the same duration");
    }

    const newPlan = await this._planRepo.create(data);
    if (!newPlan) {
      throw new Error("plan creation failed");
    }

    return {
      response: { message: "plan created successfully" },
      status: STATUS_CODES.CREATED,
    };
  };

  updateActivation = async (
    planId: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const plan = await this._planRepo.findById(planId);
    if (!plan) {
      throw new Error("subscription plan not found");
    }

    let updated;
    let status: "blocked" | "unblocked";
    if (plan.isActive) {
      updated = await this._planRepo.update(planId, {
        isActive: false,
      });
      status = "blocked";
    } else {
      updated = await this._planRepo.update(planId, {
        isActive: true,
      });
      status = "unblocked";
    }

    if (!updated) {
      throw new Error("subcription plan activation update failed");
    }

    return {
      response: { message: `plan ${status} successfully` },
      status: STATUS_CODES.OK,
    };
  };
}
