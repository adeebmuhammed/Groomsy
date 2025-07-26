import { MessageResponseDto, SlotCreateRequestDto, SlotListResponseDto, SlotReponseDto, SlotUpdateRequestDto } from "../dto/slot.dto";
import { ISlot } from "../models/slots.model";
import { ISlotService } from "./interfaces/ISlotService";
import { validateSlotData } from "../utils/slotValidator";
import { SlotRepository } from "../repositories/slot.repository";
import { SlotMapper } from "../mappers/slot.mapper";
import { STATUS_CODES } from "../utils/constants";
import mongoose from "mongoose";

export class SlotService implements ISlotService{
    
    constructor( private _slotRepo:SlotRepository){}

    getSlotsByBarber = async (
  barberId: string,
  page: number,
  limit: number
): Promise<{ response: SlotListResponseDto; status: number }> => {
  if (!barberId) {
    throw new Error("Barber id is required");
  }

  const { slots, totalCount } = await this._slotRepo.findByBarber(barberId, page, limit);

  const response: SlotListResponseDto = {
    data: SlotMapper.toSlotDtoArray(slots),
    message: "Slots fetched successfully",
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      itemsPerPage: limit
    }
  };

  return {
    response,
    status: STATUS_CODES.OK
  };
};

    
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
            barber: new mongoose.Types.ObjectId(barberId),
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

    updateSlot = async (slotId: string, data: SlotCreateRequestDto): Promise<{ response: SlotReponseDto; message: string; status: number; }> => {
        if (!slotId || !data) {
            throw new Error("slot id and slot data is required")
        }

        const errors = validateSlotData(data)
        if (errors.length > 0) {
            throw new Error(errors.join(" "));
        }

        const existingSlot = await this._slotRepo.findById(slotId)
        if (!existingSlot) {
            throw new Error("slot not found")
        }

        const updatedSlot = await this._slotRepo.update(slotId,data)
        if (!updatedSlot) {
            throw new Error("slot updation failed")
        }

        return{
            response: SlotMapper.toSlotResponse(updatedSlot),
            message: "slot updated successfully",
            status: STATUS_CODES.OK
        }
    }

    deleteSlot = async (slotId: string): Promise<{ response: MessageResponseDto; status: number; }> => {
        if (!slotId) {
            throw new Error("slot id is required")
        }

        const deletedSlot = await this._slotRepo.deleteSlot(slotId)
        if (!deletedSlot) {
            throw new Error("slot deletion failed")
        }

        return{
            response:{message: "slot deleted successfully"},
            status: STATUS_CODES.OK
        }
    }
}