import { Request, Response } from "express";
import { IBookingService } from "../services/interfaces/IBookingService";
import { IBookingController } from "./interfaces/IBookingController";
import { ROLES, STATUS_CODES } from "../utils/constants";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(TYPES.IBookingService) private _bookingService: IBookingService
  ) {}

  fetchBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const role = req.query.role as ROLES;
      const id = req.query.id as string | undefined;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { response } = await this._bookingService.fetchBookings(
        role,
        id,
        page,
        limit
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
      });
    }
  };

  stageBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const data = req.body;

      const { response } = await this._bookingService.stageBooking(
        userId,
        data
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to stage booking",
      });
    }
  };

  confirmBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const bookingId = req.query.bookingId as string;
      const data = req.body;

      const { response } = await this._bookingService.confirmBooking(
        bookingId,
        userId,
        data
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to confirm booking",
      });
    }
  };

  couponApplication = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingId = req.query.bookingId as string;
      const couponCode = req.body.couponCode as string;

      const { response } = await this._bookingService.couponApplication(
        bookingId,
        couponCode
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to apply coupon",
      });
    }
  };

  verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        bookingId,
      } = req.body;

      const { response } = await this._bookingService.verifyPayment(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        bookingId
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to verify payment",
      });
    }
  };

  updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const role = req.query.role as ROLES;
      const bookingId = req.params.id as string;

      const { bookingStatus } = req.body;

      const { response } = await this._bookingService.updateBookingStatus(
        role,
        bookingId,
        bookingStatus
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

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

  getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingId = req.params["id"] as string;

      const { response } = await this._bookingService.getBookingById(bookingId);
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch booking by id",
      });
    }
  };

  getBookingsByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const role = req.query.role as ROLES;
      const userId = req.query["id"] as string | undefined; // optional now
      const bookingStatus = req.query.status as
        | "pending"
        | "staged"
        | "cancelled"
        | "finished";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { response } = await this._bookingService.getBookingsByStatus(
        bookingStatus,
        userId || null, // pass null if no id
        page,
        limit,
        role
      );

      const status = response ? STATUS_CODES.OK : STATUS_CODES.CONFLICT;
      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch bookings by status",
      });
    }
  };
}
