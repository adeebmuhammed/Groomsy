import { Request, Response } from "express";
import { IBarberUnavailabilityController } from "./interfaces/IBarberUnavailabilityController";
import { IBarberUnavailabilityService } from "../services/interfaces/IBarberUnavailabilityService";
import { STATUS_CODES } from "../utils/constants";

export class BarberUnavailabilityController
  implements IBarberUnavailabilityController
{
  constructor(
    private _barberUnavailabilityService: IBarberUnavailabilityService
  ) {}

  editWeeklyDayOff = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.params["id"];
      const day = req.body.day as string;

      const { response, status } =
        await this._barberUnavailabilityService.editWeeklyDayOff(barberId, day);

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to edit weekly off",
      });
    }
  };
}
