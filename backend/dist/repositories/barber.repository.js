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
exports.BarberRepository = void 0;
const barber_model_1 = __importDefault(require("../models/barber.model"));
const base_repository_1 = require("./base.repository");
const inversify_1 = require("inversify");
let BarberRepository = class BarberRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(barber_model_1.default);
    }
    async findByEmail(email) {
        return await barber_model_1.default.findOne({ email: email });
    }
    async findBySearchTerm(search, page, limit, district) {
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (district) {
            query.district = district;
        }
        const skip = (page - 1) * limit;
        const [barbers, totalCount] = await Promise.all([
            barber_model_1.default.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
            barber_model_1.default.countDocuments(query),
        ]);
        return { barbers, totalCount };
    }
};
exports.BarberRepository = BarberRepository;
exports.BarberRepository = BarberRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], BarberRepository);
