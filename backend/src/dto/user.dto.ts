export class UserRegisterRequestDto {
  name!: string;
  email!: string;
  phone?: string;
  password!: string;
  confirmPassword!: string;
}

export class MessageResponseDto {
  message!: string;
}

export class UserLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  status!: string;
  message!: string;
}