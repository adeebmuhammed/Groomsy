import { Request, Response } from "express";
import { IBarberUnavailabilityController } from "./interfaces/IBarberUnavailabilityController";
import { IBarberUnavailabilityService } from "../services/interfaces/IBarberUnavailabilityService";
import { STATUS_CODES } from "../utils/constants";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class BarberUnavailabilityController
  implements IBarberUnavailabilityController
{
  constructor(
    @inject(TYPES.IBarberUnavailabilityService)
    private _barberUnavailabilityService: IBarberUnavailabilityService
  ) {}

  fetchBarberUnavailability = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const barberId = req.params["id"];

      const { response, status } =
        await this._barberUnavailabilityService.fetchBarberUnavailability(
          barberId
        );

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch barber unavailability",
      });
    }
  };

  editWeeklyDayOff = async (req: Request, res: Response): Promise<void> => {
    console.log("req reached");
    
    try {
      const barberId = req.params["id"];
      const day = req.body.day as string;

      const { response, status } =
        await this._barberUnavailabilityService.editWeeklyDayOff(barberId, day);

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to edit weekly off",
      });
    }
  };

  addOffDay = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.params["id"];
      const data = req.body;

      const { response, status } =
        await this._barberUnavailabilityService.addOffDay(barberId, data);

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to add special off",
      });
    }
  };

  removeOffDay = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.params["id"];
      const date = req.query.date as string;

      const { response, status } =
        await this._barberUnavailabilityService.removeOffDay(barberId, date);

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove special off",
      });
    }
  };
}
