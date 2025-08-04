import { Request,Response } from 'express'

export interface IOfferController{
    getAllOffers(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    edit(req: Request, res: Response): Promise<void>;
    delete(req:Request, res: Response): Promise<void>;
}