import { Request,Response } from "express";

export interface IFavoritesController{
    updateFavorites( req: Request, res: Response): Promise<void>;
}