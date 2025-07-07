import { IBarberRepository } from "./interfaces/IBarberRepository";
import Barbers,{IBarber} from "../models/barber.model";
import { BaseRepository } from "./base.repository";

export class BarberRepository extends BaseRepository<IBarber> implements IBarberRepository{

    constructor(){
        super(Barbers)
    }

    async findByEmail(email: string): Promise<IBarber | null> {
        return await Barbers.findOne({email: email})
    }
}