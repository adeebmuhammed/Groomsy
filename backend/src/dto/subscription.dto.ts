export interface confirmSubscription {
  message: string;
  orderId: string;
  amount: string | number;
  currency: string;
  keyId: string;
}

export interface SubscriptionDto {
  id: string;
  plan: string;
  barber: string;
  expiryDate: Date;
  status: "active" | "pending";
  razorpayOrderId?: string;
}
