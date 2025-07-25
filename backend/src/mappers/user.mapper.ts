import { IUser } from "../models/user.model";
import { UserLoginResponseDto,MessageResponseDto } from "../dto/user.dto";

export class UserMapper{
    static toLoginResponse(
    user: IUser,
    message: string
  ): UserLoginResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      message,
    };
  }

  static toMessageResponse(message: string): MessageResponseDto {
    return { message };
  }
}