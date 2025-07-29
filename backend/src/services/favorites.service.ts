import { MessageResponseDto } from "../dto/favorites.dto";
import { BarberRepository } from "../repositories/barber.repository";
import { FavoritesRepository } from "../repositories/favorites.repository";
import { UserRepository } from "../repositories/user.repository";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IFavoritesService } from "./interfaces/IFavoritesService";

export class FavoritesService implements IFavoritesService{
    private _userRepo = new UserRepository()
    private _barberRepo = new BarberRepository()
    constructor( private _favoritesRepo: FavoritesRepository){}

    updateFavorites = async (
  userId: string,
  barberId: string
): Promise<{ response: MessageResponseDto; status: number }> => {
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
    status: STATUS_CODES.OK,
  };
};
}