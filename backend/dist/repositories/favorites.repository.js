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
exports.FavoritesRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const favorites_model_1 = __importDefault(require("../models/favorites.model"));
const base_repository_1 = require("./base.repository");
const inversify_1 = require("inversify");
let FavoritesRepository = class FavoritesRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(favorites_model_1.default);
    }
    async createNew(userId) {
        return await favorites_model_1.default.create({ userId, barbers: [] });
    }
    async updateFavorites(userId, barberId) {
        const barberObjectId = new mongoose_1.default.Types.ObjectId(barberId);
        const existing = await favorites_model_1.default.findOne({
            userId,
            "barbers.barberId": barberObjectId,
        });
        if (existing) {
            await favorites_model_1.default.updateOne({ userId }, { $pull: { barbers: { barberId: barberObjectId } } });
            return { added: false };
        }
        else {
            await favorites_model_1.default.updateOne({ userId }, { $addToSet: { barbers: { barberId: barberObjectId } } }, { upsert: true });
            return { added: true };
        }
    }
    async getFavoritesByUser(userId) {
        return await favorites_model_1.default.findOne({ userId });
    }
};
exports.FavoritesRepository = FavoritesRepository;
exports.FavoritesRepository = FavoritesRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], FavoritesRepository);
