import { SlotCreateRequestDto, SlotReponseDto } from "../dto/slot.dto";
import { ISlot } from "../models/slots.model";
import { ISlotService } from "./interfaces/ISlotService";
import { validateSlotData } from "../utils/slotValidator";
import { SlotRepository } from "../repositories/slot.repository";
import { SlotMapper } from "../mappers/slot.mapper";
import { STATUS_CODES } from "../utils/constants";
import mongoose from "mongoose";

export class SlotService implements ISlotService{
    
    constructor( private _slotRepo:SlotRepository){}
    
    createSlot = async (barberId: string, data: SlotCreateRequestDto): Promise<{ response: SlotReponseDto; message: string; status: number; }> =>{

        if (!barberId || !data) {
            throw new Error("barber id and slot data is required")
        }

        const errors = validateSlotData(data)
        if (errors.length > 0) {
            throw new Error(errors.join(" "));
        }

        const similarSlot = await this._slotRepo.findSimilarSlot(barberId,data.startTime,data.endTime,data.date)
        if (similarSlot) {
            throw new Error("Slot with same date and time exists")
        }

        const slot = await this._slotRepo.create({
    ...data,
    barber: new mongoose.Types.ObjectId(barberId), // 👈 fix added here
  });
        if (!slot) {
            throw new Error("failed to create slot")
        }

        return{
            response: SlotMapper.toSlotResponse(slot),
            message: "slot created successfully",
            status: STATUS_CODES.CREATED
        }
    }
}