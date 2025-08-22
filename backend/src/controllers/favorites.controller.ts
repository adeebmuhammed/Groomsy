import { Request, Response } from "express";
import { IFavoritesController } from "./interfaces/IFavoritesController";
import { STATUS_CODES } from "../utils/constants";
import { IFavoritesService } from "../services/interfaces/IFavoritesService";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class FavoritesController implements IFavoritesController {
  constructor(
    @inject(TYPES.IFavoritesService)
    private _favoritesService: IFavoritesService
  ) {}

  getFavoritesByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { response, status } =
        await this._favoritesService.getFavoritesByUser(userId, page, limit);

      res.status(status).json(response);
    } catch (error) {
      console.error("error fetching favorites:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "fetching favorites failed",
      });
    }
  };

  updateFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, barberId } = req.body;

      const { response, status } = await this._favoritesService.updateFavorites(
        userId,
        barberId
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("error updating favorites:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Update favorites failed",
      });
    }
  };
}
