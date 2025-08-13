import { Request, Response } from "express";
import { ISlotController } from "./interfaces/ISlotController";
import { STATUS_CODES } from "../utils/constants";
import { ISlotService } from "../services/interfaces/ISlotService";

export class SlotController implements ISlotController {
  constructor(private _slotService: ISlotService) {}

  getSlotRulesByBarber = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.query.barberId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { response, status } = await this._slotService.getSlotRulesByBarber(
        barberId,
        page,
        limit
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("error fetching slots:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Slot fetching failed",
      });
    }
  };

  createSlotRule = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.query.barberId as string;
      const data = req.body;

      const { response, message, status } =
        await this._slotService.createSlotRule(barberId, data);

      res.status(status).json({ response, message });
    } catch (error) {
      console.error("error creating slot:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "slot creation failed",
      });
    }
  };

  updateSlotRule = async (req: Request, res: Response): Promise<void> => {
    try {
      const slotId = req.params["id"];
      const data = req.body;

      const { response, message, status } =
        await this._slotService.updateSlotRule(slotId, data);

      res.status(status).json({ response, message });
    } catch (error) {
      console.error("error updating slot:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "slot updation failed",
      });
    }
  };

  deleteSlotRule = async (req: Request, res: Response): Promise<void> => {
    try {
      const slotId = req.params["id"];

      const { response, status } = await this._slotService.deleteSlotRule(
        slotId
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("error deleting slot:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "slot deletion failed",
      });
    }
  };

  getPopulatedSlots = async (req: Request, res: Response): Promise<void> => {
    try {
      const date = req.query.date as string
      const page = parseInt(req.query.page as string) | 1
      const limit = parseInt(req.query.limit as string) | 5
      const barberId = req.params["id"]
      const serviceId = req.query.serviceId as string

      const { response,status } = await this._slotService.getPopulatedSlots(barberId,serviceId,date,page,limit)

      res.status(status).json(response)
    } catch (error) {
      console.error("error deleting slot:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "slot population failed",
      });
    }
  }
}