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

    async findBySearchTerm(search: string, page: number, limit: number): Promise<{ barbers: IBarber[]; totalCount: number }> {
        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }
            : {};
    
        const skip = (page - 1) * limit;
    
        const [barbers, totalCount] = await Promise.all([
            Barbers.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Barbers.countDocuments(query)
        ]);
    
        return { barbers, totalCount };
    }
}