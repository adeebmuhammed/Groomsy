import { Request,Response } from "express";

export interface ISlotController{
    getSlotRulesByBarber(req: Request, res: Response):Promise<void>;
    createSlotRule(req: Request, res: Response):Promise<void>;
    updateSlotRule(req: Request, res: Response):Promise<void>;
    deleteSlotRule(req: Request, res: Response):Promise<void>;
    getPopulatedSlots(req: Request, res: Response):Promise<void>;
}