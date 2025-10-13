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
  token!:string;
}

export class BarberDto {
  id!: string;
  name!: string;
  phone?: string;
  district!: string;
  status!: string
}

export class updateAddressDto {
    street?: string;
    city?: string;
    pincode?: string;
    district?: string;
}

export class BarberProfileDto{
  id!: string;
  name!: string;
  email!: string;
  phone!: string;
  address!: {
    street?: string;
    city?: string;
    pincode?: string;
    district?: string;
  }
}

export class UpdateBarberProfileDto{
  name!: string;
  email!: string;
  phone!: string;
}

export class BookingStatsResponseDto {
  constructor(
    public readonly label: string,
    public readonly count: number
  ) {}
}