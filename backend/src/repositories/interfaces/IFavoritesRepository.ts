import { UpdateResult } from "mongoose";
import { IFavorites } from "../../models/favorites.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IFavoritesRepository extends IBaseRepository<IFavorites>{
    updateFavorites(userId: string,barberId: string):Promise<{ added: boolean }>
}