export interface CreateServiceDto {
  name: string;
  description: string;
  duration: "15m" | "30m" | "45m" | "60m" | "75m" | "90" | "105" | "120";
  price: number;
}

export interface ServiceResponseDto {
  id: string;
  name: string;
  description: string;
  duration: "15m" | "30m" | "45m" | "60m" | "75m" | "90" | "105" | "120";
  price: number;
}