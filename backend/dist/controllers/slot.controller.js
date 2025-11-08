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
exports.SlotController = void 0;
const constants_1 = require("../utils/constants");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let SlotController = class SlotController {
    constructor(_slotService) {
        this._slotService = _slotService;
        this.getSlotRulesByBarber = async (req, res) => {
            try {
                const barberId = req.query.barberId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const { response } = await this._slotService.getSlotRulesByBarber(barberId, page, limit);
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
                console.error("error fetching slots:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Slot fetching failed",
                });
            }
        };
        this.createSlotRule = async (req, res) => {
            try {
                const barberId = req.query.barberId;
                const data = req.body;
                const { response, message } = await this._slotService.createSlotRule(barberId, data);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.CREATED;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json({ response, message });
            }
            catch (error) {
                console.error("error creating slot:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "slot creation failed",
                });
            }
        };
        this.updateSlotRule = async (req, res) => {
            try {
                const slotId = req.params["id"];
                const data = req.body;
                const { response, message } = await this._slotService.updateSlotRule(slotId, data);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json({ response, message });
            }
            catch (error) {
                console.error("error updating slot:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "slot updation failed",
                });
            }
        };
        this.deleteSlotRule = async (req, res) => {
            try {
                const slotId = req.params["id"];
                const { response } = await this._slotService.deleteSlotRule(slotId);
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
                console.error("error deleting slot:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "slot deletion failed",
                });
            }
        };
        this.getPopulatedSlots = async (req, res) => {
            try {
                const date = req.query.date;
                const page = parseInt(req.query.page) | 1;
                const limit = parseInt(req.query.limit) | 5;
                const barberId = req.params["id"];
                const serviceId = req.query.serviceId;
                const { response } = await this._slotService.getPopulatedSlots(barberId, serviceId, date, page, limit);
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
                console.error("error deleting slot:", error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "slot population failed",
                });
            }
        };
    }
};
exports.SlotController = SlotController;
exports.SlotController = SlotController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ISlotService)),
    __metadata("design:paramtypes", [Object])
], SlotController);
