import { Request, Response } from 'express'

export interface IBookingController {
    createBooking(req: Request, res: Response): Promise<void>;
    updateBookingStatus(req: Request, res: Response): Promise<void>;
}