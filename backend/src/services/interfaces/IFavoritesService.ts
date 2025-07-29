import { MessageResponseDto } from "../../dto/favorites.dto";

export interface IFavoritesService{
    updateFavorites(userId:string,barberId:string):Promise<{response: MessageResponseDto, status: number}>
}