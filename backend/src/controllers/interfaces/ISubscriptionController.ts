import { Request, Response } from "express";

export interface ISubscriptionController{
    manageSubscription(req: Request, res: Response): Promise<void>;
}