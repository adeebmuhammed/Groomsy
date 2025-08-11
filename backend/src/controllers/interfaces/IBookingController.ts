import { Request, Response } from 'express'

export interface IBookingController {
    fetchBookings(req: Request, res: Response): Promise<void>;
    stageBooking(req: Request, res: Response): Promise<void>;
    confirmBooking(req: Request, res: Response): Promise<void>;
    updateBookingStatus(req: Request, res: Response): Promise<void>;
}