import { Request,Response } from "express";

export interface IUserController{
    register(req:Request,res:Response):Promise<void>;
    verifyOTP(req:Request,res:Response):Promise<void>;
    resendOTP(req:Request,res:Response):Promise<void>;
    googleCallback(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response):Promise<void>;
    resetPassword(req: Request, res: Response):Promise<void>;
    logout(req: Request, res: Response): Promise<void>;

    fetchAllBarbers(req: Request, res: Response): Promise<void>;
    fetchBarbersAndSlotRules(req: Request, res: Response): Promise<void>;
    fetchBarberDetailsById(req: Request, res: Response): Promise<void>;

    getUserProfileById(req: Request, res: Response): Promise<void>;
    updateUserProfile(req: Request, res: Response): Promise<void>;
    updateProfilePicture(req: Request, res: Response): Promise<void>;
    deleteProfilePicture(req: Request, res: Response): Promise<void>;
}