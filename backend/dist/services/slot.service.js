"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotService = void 0;
const slotValidator_1 = require("../utils/slotValidator");
const slot_mapper_1 = require("../mappers/slot.mapper");
const mongoose_1 = __importDefault(require("mongoose"));
const slot_generator_1 = require("../utils/slot.generator");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let SlotService = class SlotService {
    constructor(_slotRepo, _serviceRepo, _barberUnavailabilityRepo, _bookingRepo) {
        this._slotRepo = _slotRepo;
        this._serviceRepo = _serviceRepo;
        this._barberUnavailabilityRepo = _barberUnavailabilityRepo;
        this._bookingRepo = _bookingRepo;
        this.getSlotRulesByBarber = async (barberId, page, limit) => {
            if (!barberId) {
                throw new Error("Barber id is required");
            }
            const { slotRules, totalCount } = await this._slotRepo.findByBarber(barberId, page, limit);
            const response = {
                data: slot_mapper_1.SlotMapper.toSlotDtoArray(slotRules),
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
        this.createSlotRule = async (barberId, data) => {
            if (!barberId || !data) {
                throw new Error("barber id and slot data is required");
            }
            const errors = (0, slotValidator_1.validateSlotData)(data);
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
                    throw new Error(`The barber is unavailable on ${slot.day} (weekly off). Please choose a different day.`);
                }
                for (const otherSlot of slotRules) {
                    for (const s of otherSlot.slots) {
                        if (s.day === slot.day &&
                            (0, slotValidator_1.isOverlapping)(slot.startTime, slot.endTime, s.startTime, s.endTime)) {
                            throw new Error(`Overlap detected: A slot already exists on ${slot.day} from ${s.startTime} to ${s.endTime}. Please choose another time.`);
                        }
                    }
                }
            }
            const slot = await this._slotRepo.create({
                ...data,
                barber: new mongoose_1.default.Types.ObjectId(barberId),
            });
            if (!slot) {
                throw new Error("failed to create slot");
            }
            return {
                response: slot_mapper_1.SlotMapper.toSlotResponse(slot),
                message: "slot created successfully",
            };
        };
        this.updateSlotRule = async (slotId, data) => {
            if (!slotId || !data) {
                throw new Error("slot id and slot data is required");
            }
            const errors = (0, slotValidator_1.validateSlotData)(data);
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
            const { slotRules } = await this._slotRepo.findByBarber(existingSlot.barber.toString(), 1, 100);
            for (const slot of data.slots) {
                if (slot.day === unavailability.weeklyOff) {
                    throw new Error(`The barber is unavailable on ${slot.day} (weekly off). Please choose a different day.`);
                }
                for (const otherSlot of slotRules) {
                    if (otherSlot.id === slotId)
                        continue;
                    for (const s of otherSlot.slots) {
                        if (s.day === slot.day &&
                            (0, slotValidator_1.isOverlapping)(slot.startTime, slot.endTime, s.startTime, s.endTime)) {
                            throw new Error(`Overlap detected: A slot already exists on ${slot.day} from ${s.startTime} to ${s.endTime}. Please choose another time.`);
                        }
                    }
                }
            }
            const updatedSlot = await this._slotRepo.update(slotId, data);
            if (!updatedSlot) {
                throw new Error("slot updation failed");
            }
            return {
                response: slot_mapper_1.SlotMapper.toSlotResponse(updatedSlot),
                message: "slot updated successfully",
            };
        };
        this.deleteSlotRule = async (slotId) => {
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
        this.getPopulatedSlots = async (barberId, serviceId, date) => {
            const selectedDate = new Date(date);
            const selectedDayName = selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
            });
            const slotRules = await this._slotRepo.find({ barber: barberId });
            if (!slotRules) {
                throw new Error("slot rules not found");
            }
            const filteredRules = slotRules.filter((rule) => rule.slots.some((slot) => slot.day === selectedDayName));
            if (!filteredRules.length) {
                throw new Error("slots for the given date is not available");
            }
            const service = await this._serviceRepo.findById(serviceId);
            if (!service) {
                throw new Error("service not found");
            }
            const slots = (0, slot_generator_1.generateSlotsFromRules)(filteredRules, selectedDate, selectedDate, service.duration);
            return {
                response: slots,
            };
        };
    }
};
exports.SlotService = SlotService;
exports.SlotService = SlotService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISlotRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IServiceRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBarberUnavailabilityRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], SlotService);
