import { MessageResponseDto } from "../../dto/base.dto";
import {
  confirmSubscription,
  SubscriptionDto,
} from "../../dto/subscription.dto";

export interface ISubscriptionService {
  getSubscriptionDetailsByBarber(
    barberId: string
  ): Promise<{ response: SubscriptionDto }>;
  manageSubscription(
    barberId: string,
    planId: string
  ): Promise<{ response: confirmSubscription }>;
  renewSubscription(
    barberId: string
  ): Promise<{ response: confirmSubscription }>;
  verifySubscriptionPayment(
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string,
    barberId: string
  ): Promise<{ response: MessageResponseDto }>;
}
