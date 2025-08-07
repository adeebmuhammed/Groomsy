import BarberUnavailability, { IBarberUnavailability } from "../models/barber.unavailablity.model";
import { BaseRepository } from "./base.repository";
import { IBarberUnavailabilityRepository } from "./interfaces/IBarberUnavailabilityRepository";

export class BarberUnavailabilityRepository
  extends BaseRepository<IBarberUnavailability>
  implements IBarberUnavailabilityRepository {

    constructor(){
        super(BarberUnavailability)
    }
  }