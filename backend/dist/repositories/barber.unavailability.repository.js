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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarberUnavailabilityRepository = void 0;
const barber_unavailablity_model_1 = __importDefault(require("../models/barber.unavailablity.model"));
const base_repository_1 = require("./base.repository");
const inversify_1 = require("inversify");
let BarberUnavailabilityRepository = class BarberUnavailabilityRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(barber_unavailablity_model_1.default);
    }
    async addSpecialOffDays(barberId, data) {
        return await barber_unavailablity_model_1.default.updateOne({ barber: barberId }, {
            $push: {
                specialOffDays: {
                    date: data.date.toISOString().split("T")[0],
                    reason: data.reason,
                },
            },
        });
    }
    async removeSpecialOffDay(barberId, date) {
        return await barber_unavailablity_model_1.default.updateOne({ barber: barberId }, { $pull: { specialOffDays: { date } } });
    }
};
exports.BarberUnavailabilityRepository = BarberUnavailabilityRepository;
exports.BarberUnavailabilityRepository = BarberUnavailabilityRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], BarberUnavailabilityRepository);
