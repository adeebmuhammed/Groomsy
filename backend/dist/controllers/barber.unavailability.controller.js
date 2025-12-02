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
exports.BarberUnavailabilityController = void 0;
const constants_1 = require("../utils/constants");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let BarberUnavailabilityController = class BarberUnavailabilityController {
    constructor(_barberUnavailabilityService) {
        this._barberUnavailabilityService = _barberUnavailabilityService;
        this.fetchBarberUnavailability = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const { response } = await this._barberUnavailabilityService.fetchBarberUnavailability(barberId);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to fetch barber unavailability",
                });
            }
        };
        this.editWeeklyDayOff = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const day = req.body.day;
                const { response } = await this._barberUnavailabilityService.editWeeklyDayOff(barberId, day);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to edit weekly off",
                });
            }
        };
        this.addOffDay = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const data = req.body;
                const { response } = await this._barberUnavailabilityService.addOffDay(barberId, data);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to add special off",
                });
            }
        };
        this.removeOffDay = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const date = req.query.date;
                const { response } = await this._barberUnavailabilityService.removeOffDay(barberId, date);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to remove special off",
                });
            }
        };
    }
};
exports.BarberUnavailabilityController = BarberUnavailabilityController;
exports.BarberUnavailabilityController = BarberUnavailabilityController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBarberUnavailabilityService)),
    __metadata("design:paramtypes", [Object])
], BarberUnavailabilityController);
