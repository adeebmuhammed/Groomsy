export class BarberRegisterRequestDto {
  name!: string;
  email!: string;
  phone?: string;
  password!: string;
  district!: string;
}

export class BarberLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  district!: string;
  status!: string;
  message!: string;
  token!: string;
}

export class BarberDto {
  id!: string;
  name!: string;
  phone?: string;
  district!: string;
  status!: string;
  profilePicUrl?: string | null;
  profilePicKey?: string | null;
}

export class updateAddressDto {
  street?: string;
  city?: string;
  pincode?: string;
  district?: string;
}

export class BarberProfileDto {
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  address!: {
    street?: string;
    city?: string;
    pincode?: string;
    district?: string;
  };
  profilePicUrl?: string | null;
  profilePicKey?: string | null;
}

export class UpdateBarberProfileDto {
  name!: string;
  email!: string;
  phone!: string;
}

export interface BarberDashboardStatsDto {
  filter: string;
  bookings: {
    type: "bookings";
    labels: string[];
    data: number[];
    total: number;
  };
  revenue: {
    type: "revenue";
    labels: string[];
    data: number[];
    total: number;
  };
  services: {
    type: "services";
    labels: string[];
    data: number[];
    total: number;
  };
}
