import { Request, Response } from "express";

export interface IBarberUnavailabilityController{
    fetchBarberUnavailability(req: Request, res: Response): Promise<void>;
    editWeeklyDayOff(req: Request, res: Response): Promise<void>;
    addOffDay(req: Request, res: Response): Promise<void>;
    removeOffDay(req: Request, res: Response): Promise<void>;
}