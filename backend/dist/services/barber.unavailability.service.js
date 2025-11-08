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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarberUnavailabilityService = void 0;
const barber_unavailability_mapper_1 = require("../mappers/barber.unavailability.mapper");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const constants_1 = require("../utils/constants");
let BarberUnavailabilityService = class BarberUnavailabilityService {
    constructor(_barberUnavailabilityRepo, _barberRepo, _bookingRepo) {
        this._barberUnavailabilityRepo = _barberUnavailabilityRepo;
        this._barberRepo = _barberRepo;
        this._bookingRepo = _bookingRepo;
        this.fetchBarberUnavailability = async (barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const unavailability = await this._barberUnavailabilityRepo.findOne({
                barber: barberId,
            });
            if (!unavailability) {
                throw new Error("barber off days not found");
            }
            const response = barber_unavailability_mapper_1.BarberUnavailabilityMapper.toBarberUnavailabilityDto(unavailability);
            return {
                response,
            };
        };
        this.editWeeklyDayOff = async (barberId, day) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const unavailability = await this._barberUnavailabilityRepo.findOne({
                barber: barberId,
            });
            if (!unavailability) {
                throw new Error("barber unavailability not found");
            }
            const validDays = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];
            if (!validDays.includes(day)) {
                throw new Error("invalid day");
            }
            if (unavailability.weeklyOff === day) {
                throw new Error(`weekly off is already ${day}`);
            }
            const updated = await this._barberUnavailabilityRepo.update(unavailability._id.toString(), {
                weeklyOff: day,
            });
            if (!updated) {
                throw new Error("editing weekly off failed");
            }
            console.log("success");
            return {
                response: { message: "weekly off edited successfully" },
            };
        };
        this.addOffDay = async (barberId, data) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const unavailability = await this._barberUnavailabilityRepo.findOne({
                barber: barberId,
            });
            if (!unavailability) {
                throw new Error("Barber unavailability not found");
            }
            const formattedDate = new Date(data.date).toISOString().split("T")[0];
            const dayOfWeek = new Date(data.date).toLocaleDateString("en-US", {
                weekday: "long",
            });
            if (new Date(formattedDate).getTime() < Date.now()) {
                throw new Error("Date should not be in the past");
            }
            const alreadySpecialOff = unavailability.specialOffDays.some((off) => off.date === formattedDate);
            if (alreadySpecialOff) {
                throw new Error("Date is already marked as a special off day");
            }
            if (unavailability.weeklyOff === dayOfWeek) {
                throw new Error(`${dayOfWeek} is already a weekly off`);
            }
            const bookings = await this._bookingRepo.find({ barber: barberId, "slotDetails.date": formattedDate });
            for (const booking of bookings) {
                if (booking.status === "pending") {
                    const updated = await this._bookingRepo.update(booking.id, { status: "cancelled_by_barber" });
                    if (!updated) {
                        throw new Error("Failed to update booking status on the special off day");
                    }
                }
            }
            const updated = await this._barberUnavailabilityRepo.addSpecialOffDays(barberId, { date: new Date(formattedDate), reason: data.reason });
            if (!updated) {
                throw new Error("Adding off day failed");
            }
            return {
                response: { message: "Off day added successfully" },
            };
        };
        this.removeOffDay = async (barberId, date) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const unavailability = await this._barberUnavailabilityRepo.findOne({
                barber: barberId,
            });
            if (!unavailability) {
                throw new Error("Barber unavailability not found");
            }
            const formattedDate = new Date(date).toISOString().split("T")[0];
            const exists = unavailability.specialOffDays.some((off) => off.date === formattedDate);
            if (!exists) {
                throw new Error(`${date} is not exists to remove in off days`);
            }
            const updated = await this._barberUnavailabilityRepo.removeSpecialOffDay(barberId, formattedDate);
            if (!updated) {
                throw new Error("failed to remove from special off day");
            }
            return {
                response: { message: "successfully removed from special off day" },
            };
        };
    }
};
exports.BarberUnavailabilityService = BarberUnavailabilityService;
exports.BarberUnavailabilityService = BarberUnavailabilityService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBarberUnavailabilityRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IBarberRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], BarberUnavailabilityService);
