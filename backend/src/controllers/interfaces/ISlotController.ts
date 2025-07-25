import { Request,Response } from "express";

export interface ISlotController{
    createSlot(req: Request, res: Response):Promise<void>;
    updateSlot(req: Request, res: Response):Promise<void>;
    deleteSlot(req: Request, res: Response):Promise<void>;
}