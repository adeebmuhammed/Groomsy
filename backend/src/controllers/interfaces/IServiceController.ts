import { Request,Response } from "express";

export interface IServiceController{
    fetch (req: Request, res: Response):Promise<void>;
    create (req: Request, res: Response):Promise<void>;
    edit (req: Request, res: Response):Promise<void>;
    delete (req: Request, res: Response):Promise<void>;
    getServiceById(req: Request, res: Response): Promise<void>;
}