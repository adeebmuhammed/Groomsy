import { IBarber } from "../models/barber.model";
import { BarberLoginResponseDto,BarberDto } from "../dto/barber.dto";

export class BarberMapper{
    static toLoginResponse(
    barber: IBarber,
    message: string
  ): BarberLoginResponseDto {
    return {
      id: barber._id.toString(),
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      district: barber.district,
      status: barber.status,
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
}