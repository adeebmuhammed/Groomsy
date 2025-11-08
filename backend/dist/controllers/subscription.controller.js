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
exports.SubscriptionController = void 0;
const constants_1 = require("../utils/constants");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let SubscriptionController = class SubscriptionController {
    constructor(_subscriptionService) {
        this._subscriptionService = _subscriptionService;
        this.getSubscriptionDetailsByBarber = async (req, res) => {
            try {
                const barberId = req.params["id"];
                const { response } = await this._subscriptionService.getSubscriptionDetailsByBarber(barberId);
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
                console.error("failed to fetch subscription details:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "failed to fetch subscription details",
                });
            }
        };
        this.manageSubscription = async (req, res) => {
            try {
                const { barberId, planId } = req.body;
                const { response } = await this._subscriptionService.manageSubscription(barberId, planId);
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
                console.error("failed to manage subscription:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "failed to manage subscription",
                });
            }
        };
        this.verifySubscriptionPayment = async (req, res) => {
            try {
                const { razorpay_payment_id, razorpay_order_id, razorpay_signature, barberId, } = req.body;
                if (!razorpay_payment_id ||
                    !razorpay_order_id ||
                    !razorpay_signature ||
                    !barberId) {
                    res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({
                        error: "All payment verification fields are required",
                    });
                    return;
                }
                const { response } = await this._subscriptionService.verifySubscriptionPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature, barberId);
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
                console.error("failed to verify subscription payment:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "failed to verify subscription payment",
                });
            }
        };
        this.renewSubscription = async (req, res) => {
            try {
                const { barberId } = req.body;
                const { response } = await this._subscriptionService.renewSubscription(barberId);
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
                console.error("failed to renew subscription:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "failed to renew subscription",
                });
            }
        };
    }
};
exports.SubscriptionController = SubscriptionController;
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionService)),
    __metadata("design:paramtypes", [Object])
], SubscriptionController);
