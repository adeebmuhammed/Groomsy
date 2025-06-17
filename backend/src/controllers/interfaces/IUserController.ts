import { Request,Response } from "express";

export interface IUserController{
    register(req:Request,res:Response):Promise<void>;
    verifyOTP(req:Request,res:Response):Promise<void>;
    resendOTP(req:Request,res:Response):Promise<void>;
    googleCallback(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
}