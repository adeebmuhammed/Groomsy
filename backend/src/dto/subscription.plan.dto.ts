export interface CreateSubscriptionPlanDto {
  name: string;
  price: number;
  renewalPrice: number;
  duration: number;
  durationUnit: "month" | "year" | "day";
  description?: string;
  features: SubscriptionFeature[];
}

export interface SubscriptionPlanDto {
  id: string;
  name: string;
  price: number;
  renewalPrice: number;
  duration: number;
  durationUnit: "month" | "year" | "day";
  description?: string;
  isActive: boolean;
  features: SubscriptionFeature[];
}

export type SubscriptionFeature =
  | "Dashboard"
  | "Slots"
  | "Bookings"
  | "Unavailability";