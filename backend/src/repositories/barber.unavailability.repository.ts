import { UpdateResult } from "mongoose";
import BarberUnavailability, {
  IBarberUnavailability,
} from "../models/barber.unavailablity.model";
import { BaseRepository } from "./base.repository";
import { IBarberUnavailabilityRepository } from "./interfaces/IBarberUnavailabilityRepository";
import { injectable } from "inversify";

@injectable()
export class BarberUnavailabilityRepository
  extends BaseRepository<IBarberUnavailability>
  implements IBarberUnavailabilityRepository
{
  constructor() {
    super(BarberUnavailability);
  }

  async addSpecialOffDays(
    barberId: string,
    data: { date: Date; reason: string }
  ): Promise<UpdateResult | null> {
    return await BarberUnavailability.updateOne(
      { barber: barberId },
      {
        $push: {
          specialOffDays: {
            date: data.date.toISOString().split("T")[0],
            reason: data.reason,
          },
        },
      }
    );
  }

  async removeSpecialOffDay(
    barberId: string,
    date: string
  ): Promise<UpdateResult | null> {
    return await BarberUnavailability.updateOne(
      { barber: barberId },
      { $pull: { specialOffDays: { date } } }
    );
  }
}
