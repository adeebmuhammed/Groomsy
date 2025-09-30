import { FavoritesListResponseDto } from "../../dto/favorites.dto";
import { MessageResponseDto } from "../../dto/base.dto";

export interface IFavoritesService{
    getFavoritesByUser(userId:string,page: number,limit: number):Promise<{response: FavoritesListResponseDto,}>
    updateFavorites(userId:string,barberId:string):Promise<{response: MessageResponseDto,}>
}