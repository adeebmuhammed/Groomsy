import {
  MessageResponseDto,
  SlotRuleCreateRequestDto,
  SlotRuleListResponseDto,
  SlotRuleReponseDto,
  SlotRuleUpdateRequestDto,
} from "../dto/slot.dto";
import { ISlotRule } from "../models/slots.model";
import { ISlotService } from "./interfaces/ISlotService";
import { validateSlotData } from "../utils/slotValidator";
import { SlotMapper } from "../mappers/slot.mapper";
import { STATUS_CODES } from "../utils/constants";
import mongoose from "mongoose";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository";

export class SlotService implements ISlotService {
  constructor(private _slotRepo: ISlotRepository) {}

  getSlotRulesByBarber = async (
    barberId: string,
    page: number,
    limit: number
  ): Promise<{ response: SlotRuleListResponseDto; status: number }> => {
    if (!barberId) {
      throw new Error("Barber id is required");
    }

    const { slots, totalCount } = await this._slotRepo.findByBarber(
      barberId,
      { page, limit }
    );

    const response: SlotRuleListResponseDto = {
      data: SlotMapper.toSlotDtoArray(slots),
      message: "Slots fetched successfully",
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    };

    return {
      response,
      status: STATUS_CODES.OK,
    };
  };

  createSlotRule = async (
    barberId: string,
    data: SlotRuleCreateRequestDto
  ): Promise<{ response: SlotRuleReponseDto; message: string; status: number }> => {
    if (!barberId || !data) {
      throw new Error("barber id and slot data is required");
    }

    const errors = validateSlotData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    for (const slotItem of data.slots) {
    const similarSlot = await this._slotRepo.findSimilarSlot(
      barberId,
      slotItem.startTime,
      slotItem.endTime,
      slotItem.day
    );

    if (similarSlot) {
      throw new Error(`Slot already exists for ${slotItem.day} at the same time`);
    }
  }

    const slot = await this._slotRepo.create({
      ...data,
      barber: new mongoose.Types.ObjectId(barberId),
    });

    if (!slot) {
      throw new Error("failed to create slot");
    }

    return {
      response: SlotMapper.toSlotResponse(slot),
      message: "slot created successfully",
      status: STATUS_CODES.CREATED,
    };
  };

  updateSlotRule = async (
    slotId: string,
    data: SlotRuleCreateRequestDto
  ): Promise<{ response: SlotRuleReponseDto; message: string; status: number }> => {
    if (!slotId || !data) {
      throw new Error("slot id and slot data is required");
    }

    const errors = validateSlotData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    const existingSlot = await this._slotRepo.findById(slotId);
    if (!existingSlot) {
      throw new Error("slot not found");
    }

    const updatedSlot = await this._slotRepo.update(slotId, data);
    if (!updatedSlot) {
      throw new Error("slot updation failed");
    }

    return {
      response: SlotMapper.toSlotResponse(updatedSlot),
      message: "slot updated successfully",
      status: STATUS_CODES.OK,
    };
  };

  deleteSlotRule = async (
    slotId: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    if (!slotId) {
      throw new Error("slot id is required");
    }

    const deletedSlot = await this._slotRepo.deleteSlot(slotId);
    if (!deletedSlot) {
      throw new Error("slot deletion failed");
    }

    return {
      response: { message: "slot deleted successfully" },
      status: STATUS_CODES.OK,
    };
  };
}
