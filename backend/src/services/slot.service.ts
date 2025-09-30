import {
  SlotResponseDto,
  SlotRuleCreateRequestDto,
  SlotRuleListResponseDto,
  SlotRuleReponseDto,
} from "../dto/slot.dto";
import { ISlotService } from "./interfaces/ISlotService";
import { isOverlapping, validateSlotData } from "../utils/slotValidator";
import { SlotMapper } from "../mappers/slot.mapper";
import { STATUS_CODES } from "../utils/constants";
import mongoose from "mongoose";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository";
import { generateSlotsFromRules } from "../utils/slot.generator";
import { MessageResponseDto } from "../dto/base.dto";
import { IServiceRepository } from "../repositories/interfaces/IServiceRepository";
import { IBarberUnavailabilityRepository } from "../repositories/interfaces/IBarberUnavailabilityRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class SlotService implements ISlotService {
  constructor(
    @inject(TYPES.ISlotRepository) private _slotRepo: ISlotRepository,
    @inject(TYPES.IServiceRepository) private _serviceRepo: IServiceRepository,
    @inject(TYPES.IBarberUnavailabilityRepository)
    private _barberUnavailabilityRepo: IBarberUnavailabilityRepository,
    @inject(TYPES.IBookingRepository) private _bookingRepo: IBookingRepository
  ) {}

  getSlotRulesByBarber = async (
    barberId: string,
    page: number,
    limit: number
  ): Promise<{ response: SlotRuleListResponseDto }> => {
    if (!barberId) {
      throw new Error("Barber id is required");
    }

    const { slotRules, totalCount } = await this._slotRepo.findByBarber(
      barberId,
      page,
      limit
    );

    const response: SlotRuleListResponseDto = {
      data: SlotMapper.toSlotDtoArray(slotRules),
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
    };
  };

  createSlotRule = async (
    barberId: string,
    data: SlotRuleCreateRequestDto
  ): Promise<{
    response: SlotRuleReponseDto;
    message: string;
  }> => {
    if (!barberId || !data) {
      throw new Error("barber id and slot data is required");
    }

    const errors = validateSlotData(data);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    const unavailability = await this._barberUnavailabilityRepo.findOne({
      barber: barberId,
    });
    if (!unavailability) {
      throw new Error("barber unavailability not found");
    }

    const { slotRules } = await this._slotRepo.findByBarber(barberId, 1, 100);

    for (const slot of data.slots) {
      if (slot.day === unavailability.weeklyOff) {
        throw new Error(
          `The barber is unavailable on ${slot.day} (weekly off). Please choose a different day.`
        );
      }

      for (const otherSlot of slotRules) {
        for (const s of otherSlot.slots) {
          if (
            s.day === slot.day &&
            isOverlapping(slot.startTime, slot.endTime, s.startTime, s.endTime)
          ) {
            throw new Error(
              `Overlap detected: A slot already exists on ${slot.day} from ${s.startTime} to ${s.endTime}. Please choose another time.`
            );
          }
        }
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
    };
  };

  updateSlotRule = async (
    slotId: string,
    data: SlotRuleCreateRequestDto
  ): Promise<{
    response: SlotRuleReponseDto;
    message: string;
  }> => {
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

    const unavailability = await this._barberUnavailabilityRepo.findOne({
      barber: existingSlot.barber,
    });
    if (!unavailability) {
      throw new Error("barber unavailability not found");
    }

    const { slotRules } = await this._slotRepo.findByBarber(
      (existingSlot.barber as mongoose.Types.ObjectId).toString(),
      1,
      100
    );

    for (const slot of data.slots) {
      if (slot.day === unavailability.weeklyOff) {
        throw new Error(
          `The barber is unavailable on ${slot.day} (weekly off). Please choose a different day.`
        );
      }

      for (const otherSlot of slotRules) {
        if (otherSlot.id === slotId) continue;
        for (const s of otherSlot.slots) {
          if (
            s.day === slot.day &&
            isOverlapping(slot.startTime, slot.endTime, s.startTime, s.endTime)
          ) {
            throw new Error(
              `Overlap detected: A slot already exists on ${slot.day} from ${s.startTime} to ${s.endTime}. Please choose another time.`
            );
          }
        }
      }
    }

    const updatedSlot = await this._slotRepo.update(slotId, data);
    if (!updatedSlot) {
      throw new Error("slot updation failed");
    }

    return {
      response: SlotMapper.toSlotResponse(updatedSlot),
      message: "slot updated successfully",
    };
  };

  deleteSlotRule = async (
    slotId: string
  ): Promise<{ response: MessageResponseDto }> => {
    if (!slotId) {
      throw new Error("slot id is required");
    }

    const deletedSlot = await this._slotRepo.deleteSlot(slotId);
    if (!deletedSlot) {
      throw new Error("slot deletion failed");
    }

    return {
      response: { message: "slot deleted successfully" },
    };
  };

  getPopulatedSlots = async (
    barberId: string,
    serviceId: string,
    date: string,
    page: number,
    limit: number
  ): Promise<{ response: SlotResponseDto }> => {
    const selectedDate = new Date(date);
    const selectedDayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const slotRules = await this._slotRepo.find({ barber: barberId });

    if (!slotRules) {
      throw new Error("slot rules not found");
    }
    const filteredRules = slotRules.filter((rule) =>
      rule.slots.some((slot) => slot.day === selectedDayName)
    );

    if (!filteredRules.length) {
      throw new Error("slots for the given date is not available");
    }

    const service = await this._serviceRepo.findById(serviceId);
    if (!service) {
      throw new Error("service not found");
    }

    const slots = generateSlotsFromRules(
      filteredRules,
      selectedDate,
      selectedDate,
      service.duration,
      service.price
    );

    const startOfDayUTC = new Date(
      Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfDayUTC = new Date(
      Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const bookings = await this._bookingRepo.find({
      barberId,
      "slotDetails.date": {
        $gte: startOfDayUTC,
        $lte: endOfDayUTC,
      },
    });

    return {
      response: slots,
    };
  };
}
