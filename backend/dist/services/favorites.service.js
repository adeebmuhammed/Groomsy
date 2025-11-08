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
exports.FavoritesService = void 0;
const barber_mapper_1 = require("../mappers/barber.mapper");
const constants_1 = require("../utils/constants");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let FavoritesService = class FavoritesService {
    constructor(_favoritesRepo, _userRepo, _barberRepo) {
        this._favoritesRepo = _favoritesRepo;
        this._userRepo = _userRepo;
        this._barberRepo = _barberRepo;
        this.getFavoritesByUser = async (userId, page, limit) => {
            const user = await this._userRepo.findById(userId);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            let favorites = await this._favoritesRepo.getFavoritesByUser(userId);
            if (!favorites) {
                favorites = await this._favoritesRepo.createNew(userId);
            }
            if (favorites.barbers.length === 0) {
                const response = {
                    data: [],
                    message: "No favorites yet",
                    pagination: {
                        totalPages: 0,
                        totalItems: 0,
                        itemsPerPage: limit,
                        currentPage: page,
                    },
                };
                return { response };
            }
            const allBarbers = await Promise.all(favorites.barbers.map((barber) => this._barberRepo.findById(barber.barberId.toString())));
            const validBarbers = allBarbers.filter((b) => b !== null);
            const totalItems = validBarbers.length;
            const totalPages = Math.ceil(totalItems / limit);
            const startIndex = (page - 1) * limit;
            const paginatedBarbers = validBarbers.slice(startIndex, startIndex + limit);
            const response = {
                data: barber_mapper_1.BarberMapper.toBarberDtoArray(paginatedBarbers),
                message: "Favorite barbers fetched successfully",
                pagination: {
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                    currentPage: page,
                },
            };
            return { response };
        };
        this.updateFavorites = async (userId, barberId) => {
            const user = await this._userRepo.findById(userId);
            if (!user)
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            const barber = await this._barberRepo.findById(barberId);
            if (!barber)
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            const updated = await this._favoritesRepo.updateFavorites(userId, barberId);
            return {
                response: {
                    message: updated.added
                        ? "Barber added to favorites"
                        : "Barber removed from favorites",
                },
            };
        };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IFavoritesRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBarberRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], FavoritesService);
