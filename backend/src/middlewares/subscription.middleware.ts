import { NextFunction, Request, Response } from "express";
import { STATUS_CODES, MESSAGES } from "../utils/constants";
import jwt from "jsonwebtoken";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import { SubscriptionPlanRepository } from "../repositories/subscription.plan.repository";
import mongoose from "mongoose";
import { SubscriptionFeature } from "../dto/subscription.plan.dto";

export const subscriptionMiddleware = (
  requiredFeature: SubscriptionFeature
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth-token"];
    if (!token) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.ERROR.UNAUTHORIZED });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string;
        type: string;
      };

      if (decoded.type !== "barber") {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: MESSAGES.ERROR.FORBIDDEN });

        return;
      }

      const _subscriptionRepo = new SubscriptionRepository();
      const _planRepo = new SubscriptionPlanRepository();

      const subscription = await _subscriptionRepo.findOne({
        barber: decoded.userId,
      });
      if (!subscription) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: MESSAGES.ERROR.FORBIDDEN });

        return;
      }

      const plan = await _planRepo.findById(
        (subscription.plan as mongoose.Types.ObjectId).toString()
      );
      if (plan && requiredFeature && !plan.features.includes(requiredFeature)) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({
            message: `Your plan does not allow access to ${requiredFeature}`,
          });
        return;
      }

      const today = new Date();
      if (
        subscription.expiryDate >= today &&
        subscription.status === "active"
      ) {
        return next();
      }

      if (subscription.expiryDate < today) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: "Subscription expired" });

        return;
      }

      if (subscription.status !== "active") {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: "Subscription expired" });

        return;
      }

      return next();
    } catch (error) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.ERROR.INVALID_TOKEN });

      return;
    }
  };
};
