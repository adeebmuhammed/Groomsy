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
exports.SlotRepository = void 0;
const slots_model_1 = __importDefault(require("../models/slots.model"));
const base_repository_1 = require("./base.repository");
const inversify_1 = require("inversify");
let SlotRepository = class SlotRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(slots_model_1.default);
    }
    async findByBarber(barberId, page, limit) {
        const condition = { barber: barberId };
        const skip = (page - 1) * limit;
        const [slotRules, totalCount] = await Promise.all([
            this.findWithPagination(condition, skip, limit),
            this.countDocuments(condition),
        ]);
        return { slotRules, totalCount };
    }
    async findSimilarSlot(barberId, day, startTime, endTime) {
        return await slots_model_1.default.findOne({
            barber: barberId,
            slots: {
                $elemMatch: {
                    day: day,
                    startTime,
                    endTime,
                },
            },
        });
    }
    async deleteSlot(slotId) {
        return await slots_model_1.default.deleteOne({ _id: slotId });
    }
};
exports.SlotRepository = SlotRepository;
exports.SlotRepository = SlotRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SlotRepository);
