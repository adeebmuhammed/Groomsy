import { Request, Response } from "express";
import { ICouponController } from "./interfaces/ICouponController";
import { STATUS_CODES } from "../utils/constants";
import { ICouponService } from "../services/interfaces/ICouponService";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class CouponController implements ICouponController {
  constructor(
    @inject(TYPES.ICouponService) private _couponService: ICouponService
  ) {}

  getAllCoupons = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { response } = await this._couponService.getAllCoupons(
        search,
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
      console.error("error fetching coupons:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "coupon fetching failed",
      });
    }
  };

  createCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;

      const { response } = await this._couponService.createCoupon(data);
      let status;

      if (response) {
        status = STATUS_CODES.CREATED;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("error creating coupon:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "coupon creation failed",
      });
    }
  };

  updateCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const couponId = req.params["id"];

      const { response } = await this._couponService.updateCoupon(
        couponId,
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
      console.error("error updating coupon:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "coupon updation failed",
      });
    }
  };

  deleteCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const couponId = req.params["id"];

      const { response } = await this._couponService.deleteCoupon(couponId);
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("error deleting coupon:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "coupon deletion failed",
      });
    }
  };
}
