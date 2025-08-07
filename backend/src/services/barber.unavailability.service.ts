import mongoose from "mongoose";
import { MessageResponseDto } from "../dto/base.dto";
import { BarberRepository } from "../repositories/barber.repository";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { IBarberUnavailabilityRepository } from "../repositories/interfaces/IBarberUnavailabilityRepository";
import { IBarberUnavailabilityService } from "./interfaces/IBarberUnavailabilityService";
import { STATUS_CODES } from "../utils/constants";

export class BarberUnavailabilityService implements IBarberUnavailabilityService{
    private _barberRepo: IBarberRepository
    constructor(private _barberUnavailabilityRepo: IBarberUnavailabilityRepository){
        this._barberRepo = new BarberRepository
    }

    editWeeklyDayOff = async (barberId: string, day: string): Promise<{ response: MessageResponseDto; status: number; }> =>{
        const barber = await this._barberRepo.findById(barberId)
        if (!barber) {
            throw new Error("barber not found")
        }

        const unavailability = await this._barberUnavailabilityRepo.findOne({barber: barberId})
        if (!unavailability) {
            throw new Error("barber unavailability not found")
        }

        const validDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (!validDays.includes(day)) {
            throw new Error("invalid day")
        }

        if (unavailability.weeklyOff === day) {
            throw new Error(`weekly off is already ${day}`)
        }

        const updated = await this._barberUnavailabilityRepo.update((unavailability._id as mongoose.Types.ObjectId).toString(),{
            weeklyOff: day
        })

        if (!updated) {
            throw new Error("editing weekly off failed")
        }

        return{
            response: {message: "weekly off edited successfully"},
            status: STATUS_CODES.OK
        }
    }
}