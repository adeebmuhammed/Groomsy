import { IBarber } from "../models/barber.model";
import { BarberLoginResponseDto } from "../dto/barber.dto";

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
}