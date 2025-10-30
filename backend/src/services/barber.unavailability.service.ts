import mongoose from "mongoose";
import { MessageResponseDto } from "../dto/base.dto";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { IBarberUnavailabilityRepository } from "../repositories/interfaces/IBarberUnavailabilityRepository";
import { IBarberUnavailabilityService } from "./interfaces/IBarberUnavailabilityService";
import { BarberUnavailabilityDto } from "../dto/barber.unavailability.dto";
import { BarberUnavailabilityMapper } from "../mappers/barber.unavailability.mapper";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { MESSAGES } from "../utils/constants";

@injectable()
export class BarberUnavailabilityService
  implements IBarberUnavailabilityService
{
  constructor(
    @inject(TYPES.IBarberUnavailabilityRepository)
    private _barberUnavailabilityRepo: IBarberUnavailabilityRepository,
    @inject(TYPES.IBarberRepository) private _barberRepo: IBarberRepository,
    @inject(TYPES.IBookingRepository) private _bookingRepo: IBookingRepository
  ) {}

  fetchBarberUnavailability = async (
    barberId: string
  ): Promise<{ response: BarberUnavailabilityDto;}> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.BARBER_NOT_FOUND);
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
    };
  };

  editWeeklyDayOff = async (
    barberId: string,
    day: string
  ): Promise<{ response: MessageResponseDto;}> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.BARBER_NOT_FOUND);
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

    console.log("success");
    

    return {
      response: { message: "weekly off edited successfully" },
    };
  };

  addOffDay = async (
    barberId: string,
    data: { date: string; reason: string }
  ): Promise<{ response: MessageResponseDto;}> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.BARBER_NOT_FOUND);
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

    const bookings = await this._bookingRepo.find({barber: barberId, "slotDetails.date": formattedDate})
    for(const booking of bookings){
      if (booking.status === "pending") {
        const updated = await this._bookingRepo.update(booking.id,{ status: "cancelled_by_barber"})
        if (!updated) {
          throw new Error("Failed to update booking status on the special off day")
        }
      }
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
    };
  };

  removeOffDay = async (
    barberId: string,
    date: string
  ): Promise<{ response: MessageResponseDto;}> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.BARBER_NOT_FOUND);
    }

    const unavailability = await this._barberUnavailabilityRepo.findOne({
      barber: barberId,
    });
    if (!unavailability) {
      throw new Error("Barber unavailability not found");
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];
    const exists = unavailability.specialOffDays.some(
      (off) => off.date === formattedDate
    );
    if (!exists) {
      throw new Error(`${date} is not exists to remove in off days`);
    }

    const updated = await this._barberUnavailabilityRepo.removeSpecialOffDay(
      barberId,
      formattedDate
    );
    if (!updated) {
      throw new Error("failed to remove from special off day");
    }

    return {
      response: { message: "successfully removed from special off day" },
    };
  };
}
