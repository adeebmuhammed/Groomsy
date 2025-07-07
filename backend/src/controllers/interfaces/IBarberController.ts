import { Request,Response } from "express";

export interface IBarberController {
    signup(req: Request, res: Response): Promise<void>;
    verifyOTP(req: Request, res: Response): Promise<void>;
    resendOTP(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response):Promise<void>;
    resetPassword(req: Request, res: Response):Promise<void>;
}