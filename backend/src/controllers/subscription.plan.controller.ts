import { Request, Response } from "express";
import { ISubscriptionPlanController } from "./interfaces/ISubscriptionPlanController";
import { STATUS_CODES } from "../utils/constants";
import { ISubscriptionPlanService } from "../services/interfaces/ISubscriptionPlanService";

export class SubscriptionPlanController implements ISubscriptionPlanController {
  constructor(private _planService: ISubscriptionPlanService) {}

  getSubscriptionPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search as string || ""
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 5

        const { response,status } = await this._planService.getSubscriptionPlans(search,page,limit)

        res.status(status).json(response)
    } catch (error) {
      console.error("failed to get subscription plans:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "failed to get subscription plans",
      });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;

      const { response, status } = await this._planService.create(data);

      res.status(status).json(response);
    } catch (error) {
      console.error("failed to create subscription plan:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "failed to create subscription plan",
      });
    }
  };

  updateActivation = async (req: Request, res: Response): Promise<void> => {
    try {
      const planId = req.params["id"];

      const { response, status } = await this._planService.updateActivation(
        planId
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("failed to update activation of subscription plan:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "failed to update activation of subscription plan",
      });
    }
  };

  getPlansForBarber = async (req: Request, res: Response): Promise<void> => {
    try {
      
      const { response,status } = await this._planService.getPlansForBarber()

      res.status(status).json(response)
    } catch (error) {
      console.error("failed fetch subscription plan:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "failed to fetch of subscription plan",
      });
    }
  }
}
