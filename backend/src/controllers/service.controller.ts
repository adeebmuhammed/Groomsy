import { Request, Response } from "express";
import { IServiceController } from "./interfaces/IServiceController";
import { STATUS_CODES } from "../utils/constants";
import { IServiceService } from "../services/interfaces/IServiceService";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class ServiceController implements IServiceController {
  constructor(
    @inject(TYPES.IServiceService) private _serviceService: IServiceService
  ) {}

  fetch = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { response } = await this._serviceService.fetch(
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
      console.error("error fetching services:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Service fetching failed",
      });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;

      const { response } = await this._serviceService.create(data);
      let status;

      if (response) {
        status = STATUS_CODES.CREATED
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("error creating services:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Service creation failed",
      });
    }
  };

  edit = async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceId = req.params["id"];
      const data = req.body;

      const { response } = await this._serviceService.edit(
        serviceId,
        data
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("error editing services:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "editing service failed",
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceId = req.params["id"];

      const { response } = await this._serviceService.delete(serviceId);
      let status;

      if (response) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error("error deleting services:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "deleting service failed",
      });
    }
  };

  getServiceById = async (req: Request, res: Response): Promise<void> => {
    try {
      const serviceId = req.params["id"] as string;

      const { response } = await this._serviceService.getServiceById(
        serviceId
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch service by id",
      });
    }
  };
}
