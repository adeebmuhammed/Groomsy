import mongoose, { UpdateResult } from "mongoose";
import Favorites, { IFavorites } from "../models/favorites.model";
import { BaseRepository } from "./base.repository";
import { IFavoritesRepository } from "./interfaces/IFavoritesRepository";

export class FavoritesRepository
  extends BaseRepository<IFavorites>
  implements IFavoritesRepository
{
  constructor() {
    super(Favorites);
  }

  async updateFavorites(
    userId: string,
    barberId: string
  ): Promise<{ added: boolean }> {
    const barberObjectId = new mongoose.Types.ObjectId(barberId);

    const existing = await Favorites.findOne({
      userId,
      "barbers.barberId": barberObjectId,
    });

    if (existing) {
      await Favorites.updateOne(
        { userId },
        { $pull: { barbers: { barberId: barberObjectId } } }
      );
      return { added: false };
    } else {
      await Favorites.updateOne(
        { userId },
        { $addToSet: { barbers: { barberId: barberObjectId } } },
        { upsert: true }
      );
      return { added: true };
    }
  }

  async getFavoritesByUser(userId: string): Promise<IFavorites | null> {
    return await Favorites.findOne({ userId });
  }
}
