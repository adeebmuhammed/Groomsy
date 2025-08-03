import { Request, Response } from 'express'

export interface IBookingController {
    fetchBookings(req: Request, res: Response): Promise<void>;
    createBooking(req: Request, res: Response): Promise<void>;
    updateBookingStatus(req: Request, res: Response): Promise<void>;
}