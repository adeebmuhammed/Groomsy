export interface CreateSubscriptionPlanDto{
    name: string;
  price: number;
  renewalPrice: number;
  duration: number;
  durationUnit: "month" | "year" | "day";
  description?: string;
}

export interface SubscriptionPlanDto{
    id: string;
    name: string;
  price: number;
  renewalPrice: number;
  duration: number;
  durationUnit: "month" | "year" | "day";
  description?: string;
  isActive: boolean;
}