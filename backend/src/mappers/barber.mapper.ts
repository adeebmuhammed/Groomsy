import { IBarber } from "../models/barber.model";
import { BarberLoginResponseDto,BarberDto, BarberProfileDto } from "../dto/barber.dto";
import { MessageResponseDto } from "../dto/base.dto";

export class BarberMapper{
    static toLoginResponse(
    barber: IBarber,
    message: string,
    token: string
  ): BarberLoginResponseDto {
    return {
      id: barber._id.toString(),
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      district: barber.district,
      status: barber.status,
      token,
      message,
    };
  }

  static toBarberDto(
    barber: IBarber,
  ): BarberDto {
    return {
      id: barber._id.toString(),
      name: barber.name,
      phone: barber.phone,
      district: barber.district,
      status: barber.status,
    };
  }

  static toBarberDtoArray(barbers: IBarber[]):BarberDto[]{
    return barbers.map(barber => this.toBarberDto(barber))
  }

  static toMessageResponse(message: string): MessageResponseDto {
    return { message };
  }

  static toBarberProfileDto(
    barber: IBarber,
  ): BarberProfileDto {
    return {
      id: barber._id.toString(),
      name: barber.name,
      phone: barber.phone,
      email: barber.email,
      address: {
        district: barber.district || "",
        city: barber.address?.city || "",
        street: barber.address?.street || "",
        pincode: barber.address?.pincode || ""
      }
    };
  }
}