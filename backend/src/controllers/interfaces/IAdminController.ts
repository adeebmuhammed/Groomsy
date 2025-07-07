import { Request,Response } from "express";

export interface IAdminController{
    login(req: Request, res: Response):Promise<void>;
    logout(req: Request, res: Response):Promise<void>;
    listUsers(req: Request, res: Response):Promise<void>;
    listBarbers(req: Request, res: Response):Promise<void>;
}