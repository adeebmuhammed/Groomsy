"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanService = void 0;
const inversify_1 = require("inversify");
const subscription_plan_mapper_1 = require("../mappers/subscription.plan.mapper");
const planValidator_1 = require("../utils/planValidator");
const types_1 = require("../config/types");
let SubscriptionPlanService = class SubscriptionPlanService {
    constructor(_planRepo) {
        this._planRepo = _planRepo;
        this.getSubscriptionPlans = async (search, page, limit) => {
            const { plans, totalCount } = await this._planRepo.findBySearchTerm(search, page, limit);
            const response = {
                data: subscription_plan_mapper_1.PlanMapper.toPlanResponseArray(plans),
                message: "subscripltion plans fetched successfully",
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit,
                },
            };
            return {
                response,
            };
        };
        this.create = async (data) => {
            const errors = (0, planValidator_1.validatePlanData)(data);
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
                response: { message: "plan created successfully" }
            };
        };
        this.updateActivation = async (planId) => {
            const plan = await this._planRepo.findById(planId);
            if (!plan) {
                throw new Error("subscription plan not found");
            }
            let updated;
            let status;
            if (plan.isActive) {
                updated = await this._planRepo.update(planId, {
                    isActive: false,
                });
                status = "blocked";
            }
            else {
                updated = await this._planRepo.update(planId, {
                    isActive: true,
                });
                status = "unblocked";
            }
            if (!updated) {
                throw new Error("subcription plan activation update failed");
            }
            return {
                response: { message: `plan ${status} successfully` }
            };
        };
        this.getPlansForBarber = async () => {
            const plans = await this._planRepo.find({});
            if (!plans) {
                throw new Error("plans not found");
            }
            const response = subscription_plan_mapper_1.PlanMapper.toPlanResponseArray(plans);
            return {
                response
            };
        };
        this.getPlanById = async (planId) => {
            const plan = await this._planRepo.findById(planId);
            if (!plan) {
                throw new Error("Subscription plan not found");
            }
            const planData = subscription_plan_mapper_1.PlanMapper.toPlanResponse(plan);
            return {
                planData
            };
        };
    }
};
exports.SubscriptionPlanService = SubscriptionPlanService;
exports.SubscriptionPlanService = SubscriptionPlanService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __metadata("design:paramtypes", [Object])
], SubscriptionPlanService);
