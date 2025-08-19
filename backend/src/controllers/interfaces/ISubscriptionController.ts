import { Request, Response } from "express";

export interface ISubscriptionController{
    getSubscriptionDetailsByBarber(req: Request, res: Response): Promise<void>;
    manageSubscription(req: Request, res: Response): Promise<void>;
    verifySubscriptionPayment(req: Request, res: Response): Promise<void>
    renewSubscription(req: Request, res: Response): Promise<void>
}