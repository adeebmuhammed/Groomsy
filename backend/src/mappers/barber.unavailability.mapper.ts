import mongoose from "mongoose";
import { BarberUnavailabilityDto } from "../dto/barber.unavailability.dto";
import { IBarberUnavailability } from "../models/barber.unavailablity.model";

export class BarberUnavailabilityMapper {
  static toBarberUnavailabilityDto(
    data: IBarberUnavailability
  ): BarberUnavailabilityDto {
    return {
      id: (data._id as mongoose.Types.ObjectId).toString(),
      barber: (data.barber as mongoose.Types.ObjectId).toString(),
      weeklyOff: data.weeklyOff,
      specialOffDays: data.specialOffDays,
    };
  }
}
