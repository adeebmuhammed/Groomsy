import { IUser } from "../models/user.model";
import { UserLoginResponseDto, UserProfileDto } from "../dto/user.dto";
import { MessageResponseDto } from "../dto/base.dto";
import { BarberDto, UserDto } from "../dto/admin.dto";
import { IBarber } from "../models/barber.model";

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

  static toUserDto(user: IUser): UserDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  static toUserDtoArray(users: IUser[]): UserDto[] {
    return users.map((user) => this.toUserDto(user));
  }

  static toMessageResponse(message: string): MessageResponseDto {
    return { message };
  }

  static toProfileResponse(
    user: IUser,
  ): UserProfileDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }
}