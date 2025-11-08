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
exports.SubscriptionPlanController = void 0;
const constants_1 = require("../utils/constants");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let SubscriptionPlanController = class SubscriptionPlanController {
    constructor(_planService) {
        this._planService = _planService;
        this.getSubscriptionPlans = async (req, res) => {
            try {
                const search = req.query.search || "";
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const { response } = await this._planService.getSubscriptionPlans(search, page, limit);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error("failed to get subscription plans:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "failed to get subscription plans",
                });
            }
        };
        this.create = async (req, res) => {
            try {
                const data = req.body;
                const { response } = await this._planService.create(data);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.CREATED;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error("failed to create subscription plan:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "failed to create subscription plan",
                });
            }
        };
        this.updateActivation = async (req, res) => {
            try {
                const planId = req.params["id"];
                const { response } = await this._planService.updateActivation(planId);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error("failed to update activation of subscription plan:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "failed to update activation of subscription plan",
                });
            }
        };
        this.getPlansForBarber = async (req, res) => {
            try {
                const { response } = await this._planService.getPlansForBarber();
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error("failed fetch subscription plan:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "failed to fetch of subscription plan",
                });
            }
        };
        this.getPlanById = async (req, res) => {
            try {
                const planId = req.params["id"];
                const { planData } = await this._planService.getPlanById(planId);
                let status;
                if (planData) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
                }
                res.status(status).json(planData);
            }
            catch (error) {
                console.error("failed fetch subscription plan:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "failed to fetch of subscription plan",
                });
            }
        };
    }
};
exports.SubscriptionPlanController = SubscriptionPlanController;
exports.SubscriptionPlanController = SubscriptionPlanController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanService)),
    __metadata("design:paramtypes", [Object])
], SubscriptionPlanController);
