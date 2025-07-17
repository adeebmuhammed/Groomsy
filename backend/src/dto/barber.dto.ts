export class BarberRegisterRequestDto {
  name!: string;
  email!: string;
  phone?: string;
  password!: string;
  district!: string;
}

export class MessageResponseDto {
  message!: string;
}

export class BarberLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  district!: string;
  status!: string;
  message!: string;
}