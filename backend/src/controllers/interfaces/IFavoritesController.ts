import { Request,Response } from "express";

export interface IFavoritesController{
    getFavoritesByUser( req: Request, res: Response): Promise<void>;
    updateFavorites( req: Request, res: Response): Promise<void>;
}