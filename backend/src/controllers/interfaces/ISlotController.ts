import { Request,Response } from "express";

export interface ISlotController{
    createSlot(req: Request, ers: Response):Promise<void>;
}