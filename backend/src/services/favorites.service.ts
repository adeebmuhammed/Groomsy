import mongoose from "mongoose";
import { BarberDto } from "../dto/barber.dto";
import { FavoritesListResponseDto } from "../dto/favorites.dto";
import { BarberMapper } from "../mappers/barber.mapper";
import { IBarber } from "../models/barber.model";
import { BarberRepository } from "../repositories/barber.repository";
import { FavoritesRepository } from "../repositories/favorites.repository";
import { UserRepository } from "../repositories/user.repository";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IFavoritesService } from "./interfaces/IFavoritesService";
import { MessageResponseDto } from "../dto/base.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class FavoritesService implements IFavoritesService {
  private _userRepo = new UserRepository();
  private _barberRepo = new BarberRepository();
  constructor(
    @inject(TYPES.IFavoritesRepository)
    private _favoritesRepo: FavoritesRepository
  ) {}

  getFavoritesByUser = async (
    userId: string,
    page: number,
    limit: number
  ): Promise<{ response: FavoritesListResponseDto }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    let favorites = await this._favoritesRepo.getFavoritesByUser(userId);
    if (!favorites) {
      favorites = await this._favoritesRepo.createNew(userId);
    }

    if (favorites.barbers.length === 0) {
      const response: FavoritesListResponseDto = {
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

    const allBarbers = await Promise.all(
      favorites.barbers.map((barber) =>
        this._barberRepo.findById(barber.barberId.toString())
      )
    );

    const validBarbers = allBarbers.filter((b): b is IBarber => b !== null);

    const totalItems = validBarbers.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const paginatedBarbers = validBarbers.slice(startIndex, startIndex + limit);

    const response: FavoritesListResponseDto = {
      data: BarberMapper.toBarberDtoArray(paginatedBarbers),
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

  updateFavorites = async (
    userId: string,
    barberId: string
  ): Promise<{ response: MessageResponseDto }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);

    const barber = await this._barberRepo.findById(barberId);
    if (!barber) throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);

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
