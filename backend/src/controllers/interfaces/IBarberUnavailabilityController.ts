import { Request, Response } from "express";

export interface IBarberUnavailabilityController{
    editWeeklyDayOff(req: Request, res: Response): Promise<void>;
}