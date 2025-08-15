import { Request, Response } from "express";
import { ISubscriptionController } from "./interfaces/ISubscriptionController";
import { STATUS_CODES } from "../utils/constants";
import { ISubscriptionService } from "../services/interfaces/ISubscriptionService";

export class SubscriptionController implements ISubscriptionController {
  constructor(private _subscriptionService: ISubscriptionService) {}

  manageSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const { barberId, planId } = req.body;

      const { response, status } = await this._subscriptionService.manageSubscription(
        barberId,
        planId
      );

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

  verifySubscriptionPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature, barberId } = req.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !barberId) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "All payment verification fields are required",
        });
        return;
      }

      const { response, status } = await this._subscriptionService.verifySubscriptionPayment(
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        barberId
      );

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

      const { response, status } = await this._subscriptionService.renewSubscription(
        barberId
      );

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
