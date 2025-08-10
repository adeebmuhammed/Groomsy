import {
  SlotResponseDto,
  SlotRuleCreateRequestDto,
  SlotRuleListResponseDto,
  SlotRuleReponseDto,
} from "../dto/slot.dto";
import { ISlotRule } from "../models/slots.model";
import { ISlotService } from "./interfaces/ISlotService";
import { toUTCTimeOnly, validateSlotData } from "../utils/slotValidator";
import { SlotMapper } from "../mappers/slot.mapper";
import { STATUS_CODES } from "../utils/constants";
import mongoose from "mongoose";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository";
import { generateSlotsFromRules } from "../utils/slot.generator";
import { MessageResponseDto } from "../dto/base.dto";
import { IServiceRepository } from "../repositories/interfaces/IServiceRepository";
import { ServiceRepository } from "../repositories/service.repository";
import { IBarberUnavailabilityRepository } from "../repositories/interfaces/IBarberUnavailabilityRepository";
import { BarberUnavailabilityRepository } from "../repositories/barber.unavailability.repository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { BookingRepository } from "../repositories/booking.repository";
import { existsSync } from "fs";

export class SlotService implements ISlotService {
  private _serviceRepo: IServiceRepository;
  private _barberUnavailabilityRepo: IBarberUnavailabilityRepository;
  private _bookingRepo: IBookingRepository;
  constructor(private _slotRepo: ISlotRepository) {
    this._serviceRepo = new ServiceRepository();
    this._barberUnavailabilityRepo = new BarberUnavailabilityRepository();
    this._bookingRepo = new BookingRepository();
  }

  getSlotRulesByBarber = async (
    barberId: string,
    page: number,
    limit: number
  ): Promise<{ response: SlotRuleListResponseDto; status: number }> => {
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
      status: STATUS_CODES.OK,
    };
  };

  createSlotRule = async (
    barberId: string,
    data: SlotRuleCreateRequestDto
  ): Promise<{
    response: SlotRuleReponseDto;
    message: string;
    status: number;
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

    for (const slotItem of data.slots) {
      if (slotItem.day === unavailability.weeklyOff) {
        throw new Error(
          `Cannot create slot on ${slotItem.day} as it is the barber's weekly off`
        );
      }

      const similarSlot = await this._slotRepo.findSimilarSlot(
        barberId,
        slotItem.day,
        slotItem.startTime,
        slotItem.endTime
      );

      if (similarSlot) {
        throw new Error(
          `Slot already exists for ${slotItem.day} at the same time`
        );
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
  ): Promise<{
    response: SlotRuleReponseDto;
    message: string;
    status: number;
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

    let similarSlot: ISlotRule | null = null;

    for (const slot of data.slots) {
      if (slot.day === unavailability.weeklyOff) {
        throw new Error(
          `Cannot create slot on ${slot.day} as it is the barber's weekly off`
        );
      }

      similarSlot = await this._slotRepo.findSimilarSlot(
        existingSlot.barber.toString(),
        slot.day,
        slot.startTime,
        slot.endTime
      );

      if (similarSlot) throw new Error(`slot for the given day already exists`);
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

  getPopulatedSlots = async (
    barberId: string,
    serviceId: string,
    date: string,
    page: number,
    limit: number
  ): Promise<{ response: SlotResponseDto; status: number }> => {
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
      status: STATUS_CODES.OK,
    };
  };
}
