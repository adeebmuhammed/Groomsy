import { inject, injectable } from "inversify";
import { IReviewService } from "../services/interfaces/IReviewService";
import { STATUS_CODES } from "../utils/constants";
import { IReviewController } from "./interfaces/IReviewController";
import { Request, Response } from "express";
import { TYPES } from "../config/types";

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject(TYPES.IReviewService) private _reviewService: IReviewService
  ) {}

  getReviewsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params["userId"];
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { response } = await this._reviewService.getReviewsByUser(
        userId,
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
        error: error instanceof Error ? error.message : "Failed to get reviews",
      });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.query.userId as string;
      const bookingId = req.query.bookingId as string;
      const data = req.body;

      const { response } = await this._reviewService.create(
        userId,
        bookingId,
        data
      );
      let status;

      if (response) {
        status = STATUS_CODES.CREATED;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to create review",
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const reviewId = req.params["id"];

      const { response } = await this._reviewService.delete(reviewId);
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
          error instanceof Error ? error.message : "Failed to delete review",
      });
    }
  };
}
