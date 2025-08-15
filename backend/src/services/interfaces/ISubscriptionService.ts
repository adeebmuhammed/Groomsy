import { MessageResponseDto } from "../../dto/base.dto";
import { confirmSubscription } from "../../dto/subscription.dto";

export interface ISubscriptionService{
    manageSubscription(barberId: string,planId: string): Promise<{ response: confirmSubscription; status: number }> 
    renewSubscription(barberId: string): Promise<{ response: confirmSubscription; status: number }>
    verifySubscriptionPayment(razorpay_payment_id: string,razorpay_order_id: string,razorpay_signature: string,barberId: string): Promise<{ response: MessageResponseDto; status: number }> 
}