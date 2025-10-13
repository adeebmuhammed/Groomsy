import { Request,Response } from "express";

export interface IAdminController{
    login(req: Request, res: Response):Promise<void>;
    logout(req: Request, res: Response):Promise<void>;
    listUsers(req: Request, res: Response):Promise<void>;
    updateUserStatus(req: Request, res: Response):Promise<void>;
    listBarbers(req: Request, res: Response):Promise<void>;
    updateBarberStatus(req: Request, res: Response):Promise<void>;
    getAdminDashboardStats(req: Request, res: Response):Promise<void>;
}