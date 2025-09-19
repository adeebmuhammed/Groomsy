import { Request,Response } from "express";

export interface IBarberController {
    signup(req: Request, res: Response): Promise<void>;
    verifyOTP(req: Request, res: Response): Promise<void>;
    resendOTP(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response):Promise<void>;
    resetPassword(req: Request, res: Response):Promise<void>;
    logout(req: Request, res: Response):Promise<void>;

    getBarberProfileById(req: Request, res: Response):Promise<void>;
    updateBarberProfile(req: Request, res: Response):Promise<void>;
    updateBarberAddress(req: Request, res: Response):Promise<void>;
}