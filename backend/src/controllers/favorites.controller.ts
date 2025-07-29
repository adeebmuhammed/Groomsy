import { Request, Response } from "express";
import { IFavoritesController } from "./interfaces/IFavoritesController";
import { FavoritesService } from "../services/favorites.service";
import { STATUS_CODES } from "../utils/constants";

export class FavoritesController implements IFavoritesController{
    constructor(private _favoritesService: FavoritesService){}

    updateFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, barberId } = req.body;

    const { response, status } = await this._favoritesService.updateFavorites(userId, barberId);

    res.status(status).json(response);
  } catch (error) {
    console.error("error updating favorites:", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Update favorites failed",
    });
  }
};

}