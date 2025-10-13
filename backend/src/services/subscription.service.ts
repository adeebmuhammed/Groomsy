import mongoose from "mongoose";
import { MessageResponseDto } from "../dto/base.dto";
import { ISubscriptionPlanRepository } from "../repositories/interfaces/ISubsciptionPlanRepository";
import { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository";
import razorpayInstance from "../utils/razorpay";
import { ISubscriptionService } from "./interfaces/ISubscriptionService";
import crypto from "crypto";
import { calculateExpiryDate } from "../utils/expiryDateCalculator";
import { confirmSubscription, SubscriptionDto } from "../dto/subscription.dto";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { SubscriptionMapper } from "../mappers/subscription.mapper";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.ISubscriptionRepository)
    private _subscriptionRepo: ISubscriptionRepository,
    @inject(TYPES.ISubscriptionPlanRepository)
    private _planRepo: ISubscriptionPlanRepository,
    @inject(TYPES.IBarberRepository) private _barberRepo: IBarberRepository
  ) {}

  getSubscriptionDetailsByBarber = async (
    barberId: string
  ): Promise<{ response: SubscriptionDto }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("barber not found");
    }

    let subscription = await this._subscriptionRepo.findOne({
      barber: barberId,
    });

    let response: SubscriptionDto;
    if (subscription) {
      response = SubscriptionMapper.toSuscriptionResponse(subscription);
    } else {
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

  manageSubscription = async (
    barberId: string,
    planId: string
  ): Promise<{ response: confirmSubscription }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("barber not found");
    }

    const plan = await this._planRepo.findById(planId);
    if (!plan) throw new Error("Plan not found");

    let subscription = await this._subscriptionRepo.findOne({
      barber: barberId,
    });

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(plan.price * 100),
      currency: "INR",
      receipt: barberId + "-" + Date.now(),
    });

    let message = "";

    if (!subscription) {
      subscription = await this._subscriptionRepo.create({
        barber: new mongoose.Types.ObjectId(barberId),
        plan: new mongoose.Types.ObjectId(planId),
        expiryDate: calculateExpiryDate(plan.duration, plan.durationUnit),
        status: "pending",
        razorpayOrderId: razorpayOrder.id,
      });
      message = "Subscription created";
    } else {
      const updated = await this._subscriptionRepo.update(subscription.id, {
        plan: new mongoose.Types.ObjectId(planId),
        expiryDate: calculateExpiryDate(plan.duration, plan.durationUnit),
        razorpayOrderId: razorpayOrder.id,
        status: "pending",
      });

      if (!updated) throw new Error("Manage subscription failed");
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

  renewSubscription = async (
    barberId: string
  ): Promise<{ response: confirmSubscription }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("barber not found");
    }

    const subscription = await this._subscriptionRepo.findOne({
      barber: barberId,
    });
    if (!subscription) throw new Error("Subscription not found");

    const plan = await this._planRepo.findById(subscription.plan.toString());
    if (!plan) throw new Error("Plan not found");

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(plan.renewalPrice * 100),
      currency: "INR",
      receipt: barberId + "-" + Date.now(),
    });

    const updated = await this._subscriptionRepo.update(subscription.id, {
      expiryDate: calculateExpiryDate(plan.duration, plan.durationUnit),
      razorpayOrderId: razorpayOrder.id,
      status: "pending",
    });
    if (!updated) throw new Error("Renewal update failed");

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

  verifySubscriptionPayment = async (
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
    barberId: string
  ): Promise<{ response: MessageResponseDto }> => {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const subscription = await this._subscriptionRepo.findOne({
      barber: barberId,
    });
    if (!subscription) throw new Error("Subscription not found");

    subscription.status = "active";
    const updated = await this._subscriptionRepo.update(
      subscription.id,
      subscription
    );
    if (!updated) {
      throw new Error("manage subscription failed");
    }

    return {
      response: { message: "Subscription payment verified successfully" },
    };
  };
}
