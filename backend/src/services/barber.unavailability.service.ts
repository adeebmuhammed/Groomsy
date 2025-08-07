import mongoose from "mongoose";
import { MessageResponseDto } from "../dto/base.dto";
import { BarberRepository } from "../repositories/barber.repository";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { IBarberUnavailabilityRepository } from "../repositories/interfaces/IBarberUnavailabilityRepository";
import { IBarberUnavailabilityService } from "./interfaces/IBarberUnavailabilityService";
import { STATUS_CODES } from "../utils/constants";
import { BarberUnavailabilityDto } from "../dto/barber.unavailability.dto";
import { BarberUnavailabilityMapper } from "../mappers/barber.unavailability.mapper";

export class BarberUnavailabilityService
  implements IBarberUnavailabilityService
{
  private _barberRepo: IBarberRepository;
  constructor(
    private _barberUnavailabilityRepo: IBarberUnavailabilityRepository
  ) {
    this._barberRepo = new BarberRepository();
  }

  fetchBarberUnavailability = async (
    barberId: string
  ): Promise<{ response: BarberUnavailabilityDto; status: number }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("barber not found");
    }

    const unavailability = await this._barberUnavailabilityRepo.findOne({
      barber: barberId,
    });
    if (!unavailability) {
      throw new Error("barber off days not found");
    }

    const response =
      BarberUnavailabilityMapper.toBarberUnavailabilityDto(unavailability);

    return {
      response,
      status: STATUS_CODES.OK,
    };
  };

  editWeeklyDayOff = async (
    barberId: string,
    day: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("barber not found");
    }

    const unavailability = await this._barberUnavailabilityRepo.findOne({
      barber: barberId,
    });
    if (!unavailability) {
      throw new Error("barber unavailability not found");
    }

    const validDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    if (!validDays.includes(day)) {
      throw new Error("invalid day");
    }

    if (unavailability.weeklyOff === day) {
      throw new Error(`weekly off is already ${day}`);
    }

    const updated = await this._barberUnavailabilityRepo.update(
      (unavailability._id as mongoose.Types.ObjectId).toString(),
      {
        weeklyOff: day,
      }
    );

    if (!updated) {
      throw new Error("editing weekly off failed");
    }

    return {
      response: { message: "weekly off edited successfully" },
      status: STATUS_CODES.OK,
    };
  };

  addOffDay = async (
    barberId: string,
    data: { date: string; reason: string }
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("Barber not found");
    }

    const unavailability = await this._barberUnavailabilityRepo.findOne({
      barber: barberId,
    });
    if (!unavailability) {
      throw new Error("Barber unavailability not found");
    }

    const formattedDate = new Date(data.date).toISOString().split("T")[0];
    const dayOfWeek = new Date(data.date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (new Date(formattedDate).getTime() < Date.now()) {
      throw new Error("Date should not be in the past");
    }

    const alreadySpecialOff = unavailability.specialOffDays.some(
      (off) => off.date === formattedDate
    );
    if (alreadySpecialOff) {
      throw new Error("Date is already marked as a special off day");
    }

    if (unavailability.weeklyOff === dayOfWeek) {
      throw new Error(`${dayOfWeek} is already a weekly off`);
    }

    const updated = await this._barberUnavailabilityRepo.addSpecialOffDays(
      barberId,
      { date: new Date(formattedDate), reason: data.reason }
    );
    if (!updated) {
      throw new Error("Adding off day failed");
    }

    return {
      response: { message: "Off day added successfully" },
      status: STATUS_CODES.CREATED,
    };
  };

  removeOffDay = async (
    barberId: string,
    date: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("Barber not found");
    }

    const unavailability = await this._barberUnavailabilityRepo.findOne({
      barber: barberId,
    });
    if (!unavailability) {
      throw new Error("Barber unavailability not found");
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];
    const exists = unavailability.specialOffDays.some(
        off => off.date === formattedDate
    )
    if (!exists) {
        throw new Error(`${date} is not exists to remove in off days`)
    }

    const updated = await this._barberUnavailabilityRepo.removeSpecialOffDay(barberId,formattedDate)
    if (!updated) {
        throw new Error("failed to remove from special off day")
    }

    return{
        response: { message: "successfully removed from special off day" },
        status: STATUS_CODES.OK
    }
  };
}
