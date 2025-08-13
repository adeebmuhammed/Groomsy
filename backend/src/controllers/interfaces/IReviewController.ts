import { Request,Response } from "express";

export interface IReviewController{
    create(req: Request, res: Response):Promise<void>;
    delete(req: Request, res: Response):Promise<void>;
}