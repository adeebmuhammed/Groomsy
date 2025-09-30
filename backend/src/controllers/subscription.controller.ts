import { Request, Response } from "express";
import { ISubscriptionController } from "./interfaces/ISubscriptionController";
import { STATUS_CODES } from "../utils/constants";
import { ISubscriptionService } from "../services/interfaces/ISubscriptionService";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.ISubscriptionService)
    private _subscriptionService: ISubscriptionService
  ) {}

  getSubscriptionDetailsByBarber = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const barberId = req.params["id"];

      const { response } =
        await this._subscriptionService.getSubscriptionDetailsByBarber(
          barberId
        );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("failed to fetch subscription details:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "failed to fetch subscription details",
      });
    }
  };

  manageSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const { barberId, planId } = req.body;

      const { response } = await this._subscriptionService.manageSubscription(
        barberId,
        planId
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("failed to manage subscription:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "failed to manage subscription",
      });
    }
  };

  verifySubscriptionPayment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        barberId,
      } = req.body;

      if (
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature ||
        !barberId
      ) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "All payment verification fields are required",
        });
        return;
      }

      const { response } =
        await this._subscriptionService.verifySubscriptionPayment(
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
          barberId
        );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("failed to verify subscription payment:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "failed to verify subscription payment",
      });
    }
  };

  renewSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const { barberId } = req.body;

      const { response } = await this._subscriptionService.renewSubscription(
        barberId
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("failed to renew subscription:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "failed to renew subscription",
      });
    }
  };
}
