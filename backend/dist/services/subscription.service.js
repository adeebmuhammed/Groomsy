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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const razorpay_1 = __importDefault(require("../utils/razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const expiryDateCalculator_1 = require("../utils/expiryDateCalculator");
const subscription_mapper_1 = require("../mappers/subscription.mapper");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const constants_1 = require("../utils/constants");
let SubscriptionService = class SubscriptionService {
    constructor(_subscriptionRepo, _planRepo, _barberRepo) {
        this._subscriptionRepo = _subscriptionRepo;
        this._planRepo = _planRepo;
        this._barberRepo = _barberRepo;
        this.getSubscriptionDetailsByBarber = async (barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            let subscription = await this._subscriptionRepo.findOne({
                barber: barberId,
            });
            let response;
            if (subscription) {
                response = subscription_mapper_1.SubscriptionMapper.toSuscriptionResponse(subscription);
            }
            else {
                response = {
                    id: "",
                    plan: "No active plan",
                    barber: barberId,
                    expiryDate: new Date(0),
                    status: "pending",
                };
            }
            return {
                response,
            };
        };
        this.manageSubscription = async (barberId, planId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const plan = await this._planRepo.findById(planId);
            if (!plan)
                throw new Error("Plan not found");
            let subscription = await this._subscriptionRepo.findOne({
                barber: barberId,
            });
            const razorpayOrder = await razorpay_1.default.orders.create({
                amount: Math.round(plan.price * 100),
                currency: "INR",
                receipt: barberId + "-" + Date.now(),
            });
            let message = "";
            if (!subscription) {
                subscription = await this._subscriptionRepo.create({
                    barber: new mongoose_1.default.Types.ObjectId(barberId),
                    plan: new mongoose_1.default.Types.ObjectId(planId),
                    expiryDate: (0, expiryDateCalculator_1.calculateExpiryDate)(plan.duration, plan.durationUnit),
                    status: "pending",
                    razorpayOrderId: razorpayOrder.id,
                });
                message = "Subscription created";
            }
            else {
                const expiryDate = (0, expiryDateCalculator_1.calculateExpiryDate)(plan.duration, plan.durationUnit);
                if (expiryDate < subscription.expiryDate) {
                    throw new Error("cannot change subscription plan to another plan that's expiry date is less than current expiry date");
                }
                const updated = await this._subscriptionRepo.update(subscription.id, {
                    plan: new mongoose_1.default.Types.ObjectId(planId),
                    expiryDate,
                    razorpayOrderId: razorpayOrder.id,
                    status: "pending",
                });
                if (!updated)
                    throw new Error("Manage subscription failed");
                message = "Subscription updated";
            }
            return {
                response: {
                    message,
                    orderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    keyId: process.env.RAZORPAY_KEY_ID || "",
                },
            };
        };
        this.renewSubscription = async (barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const subscription = await this._subscriptionRepo.findOne({
                barber: barberId,
            });
            if (!subscription)
                throw new Error("Subscription not found");
            const plan = await this._planRepo.findById(subscription.plan.toString());
            if (!plan)
                throw new Error("Plan not found");
            const razorpayOrder = await razorpay_1.default.orders.create({
                amount: Math.round(plan.renewalPrice * 100),
                currency: "INR",
                receipt: barberId + "-" + Date.now(),
            });
            const updated = await this._subscriptionRepo.update(subscription.id, {
                expiryDate: (0, expiryDateCalculator_1.calculateExpiryDate)(plan.duration, plan.durationUnit),
                razorpayOrderId: razorpayOrder.id,
                status: "pending",
            });
            if (!updated)
                throw new Error("Renewal update failed");
            return {
                response: {
                    message: "Subscription renewal initiated",
                    orderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    keyId: process.env.RAZORPAY_KEY_ID || "",
                },
            };
        };
        this.verifySubscriptionPayment = async (razorpay_payment_id, razorpay_order_id, razorpay_signature, barberId) => {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");
            if (expectedSignature !== razorpay_signature) {
                throw new Error("Invalid payment signature");
            }
            const subscription = await this._subscriptionRepo.findOne({
                barber: barberId,
            });
            if (!subscription)
                throw new Error("Subscription not found");
            subscription.status = "active";
            const updated = await this._subscriptionRepo.update(subscription.id, subscription);
            if (!updated) {
                throw new Error("manage subscription failed");
            }
            return {
                response: { message: "Subscription payment verified successfully" },
            };
        };
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ISubscriptionPlanRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBarberRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], SubscriptionService);
