import { FavoritesListResponseDto, MessageResponseDto } from "../../dto/favorites.dto";

export interface IFavoritesService{
    getFavoritesByUser(userId:string,page: number,limit: number):Promise<{response: FavoritesListResponseDto, status: number}>
    updateFavorites(userId:string,barberId:string):Promise<{response: MessageResponseDto, status: number}>
}