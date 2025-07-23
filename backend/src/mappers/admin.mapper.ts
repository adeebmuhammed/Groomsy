import { IUser } from "../models/user.model";
import { IBarber } from "../models/barber.model";
import { IAdmin } from "../models/admin.model";

import { UserDto,BarberDto,AdminLoginResponseDto } from "../dto/admin.dto";

export class AdminMapper{
    static toLoginResponse(
    admin: IAdmin,
    message: string
  ): AdminLoginResponseDto {
    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
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

  static toBarberDto(barber: IBarber): BarberDto {
    return {
      id: barber._id.toString(),
      name: barber.name,
      email: barber.email,
      status: barber.status,
      district: barber.district,
      createdAt: barber.createdAt,
    };
  }

  static toBarberDtoArray(barbers: IBarber[]): BarberDto[] {
    return barbers.map((barber) => this.toBarberDto(barber));
  }
}