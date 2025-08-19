import { Request, Response } from "express";

export interface ISubscriptionPlanController {
    getSubscriptionPlans( req: Request, res: Response ): Promise<void>;
    create( req: Request, res: Response ): Promise<void>;
    updateActivation( req: Request, res: Response ): Promise<void>;
    getPlansForBarber( req: Request, res: Response ): Promise<void>;
}