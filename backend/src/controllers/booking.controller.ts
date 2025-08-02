import { Request, Response } from "express";
import { IBookingService } from "../services/interfaces/IBookingService";
import { IBookingController } from "./interfaces/IBookingController";
import { STATUS_CODES } from "../utils/constants";

export class BookingController implements IBookingController {
  constructor(private _bookingService: IBookingService) {}

  createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const data = req.body;

      const { response, status } = await this._bookingService.createBooking(
        userId,
        data
      );

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to book slot",
      });
    }
  };

  updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const role: "user" | "barber" = req.query.role as "user" | "barber";
      const bookingId = req.params.id as string;

      const { bookingStatus } = req.body;

      const { response, status } =
        await this._bookingService.updateBookingStatus(
          role,
          bookingId,
          bookingStatus
        );

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update booking status",
      });
    }
  };
}
