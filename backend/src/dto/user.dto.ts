export class UserRegisterRequestDto {
  name!: string;
  email!: string;
  phone?: string;
  password!: string;
  confirmPassword!: string;
}

export class UserLoginResponseDto {
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  status!: string;
  message!: string;
}

export class UserProfileDto{
  id!: string;
  name!: string;
  email!: string;
  phone?: string;
  profilePicUrl?: string | null;
  profilePicKey?: string | null;
}

export class UserEditProfileDto{
  name!: string;
  phone!: string;
  email!: string;
}