import { UpdateResult } from "mongoose";
import { IFavorites } from "../../models/favorites.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IFavoritesRepository extends IBaseRepository<IFavorites>{
    getFavoritesByUser(userId: string):Promise<IFavorites | null>
    updateFavorites(userId: string,barberId: string):Promise<{ added: boolean }>
}