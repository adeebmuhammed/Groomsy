import { Request, Response } from "express";
import { IOfferController } from "./interfaces/IOfferController";
import { STATUS_CODES } from "../utils/constants";
import { IOfferService } from "../services/interfaces/IOfferService";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class OfferController implements IOfferController {
  constructor(
    @inject(TYPES.IOfferService) private _offerService: IOfferService
  ) {}

  getAllOffers = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { response } = await this._offerService.getAllOffers(
        search,
        page,
        limit
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("error fetching offers:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "offer fetching failed",
      });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;

      const { response } = await this._offerService.create(data);
      let status;

      if (response) {
        status = STATUS_CODES.CREATED
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("error creating offer:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "offer creation failed",
      });
    }
  };

  edit = async (req: Request, res: Response): Promise<void> => {
    try {
      const offerId = req.params["offerId"];
      const data = req.body;

      const { response } = await this._offerService.edit(offerId, data);
      let status;

      if (response) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("error editing offer:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "offer editing failed",
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const offerId = req.params["offerId"];

      const { response } = await this._offerService.delete(offerId);
      let status;

      if (response) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("error updating status:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "status updation failed",
      });
    }
  };
}
