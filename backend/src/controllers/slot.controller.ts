import { Request, Response } from "express";
import { ISlotController } from "./interfaces/ISlotController";
import { SlotService } from "../services/slot.service";
import { STATUS_CODES } from "../utils/constants";

export class SlotController implements ISlotController{
    constructor(private _slotService: SlotService){}

    getSlotsByBarber = async (req: Request, res: Response): Promise<void> => {
  try {
    const barberId = req.query.barberId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { response, status } = await this._slotService.getSlotsByBarber(barberId, page, limit);

    res.status(status).json(response);
  } catch (error) {
    console.error("error fetching slots:", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Slot fetching failed",
    });
  }
};


    createSlot = async (req: Request, res: Response): Promise<void> =>{
        try {
            const barberId = req.query.barberId as string;
            const data = req.body

            const{ response,message,status } = await this._slotService.createSlot(barberId,data)

            res.status(status).json({ response,message})
        } catch (error) {
            console.error("error creating slot:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                error: error instanceof Error ? error.message : "slot creation failed",
            });
        }
    }

    updateSlot = async (req: Request, res: Response): Promise<void> =>{
        try {
            const slotId = req.params["id"]
            const data = req.body

            const{ response,message,status } = await this._slotService.updateSlot(slotId,data)

            res.status(status).json({ response,message })
        } catch (error) {
            console.error("error updating slot:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                error: error instanceof Error ? error.message : "slot updation failed",
            });
        }
    }

    deleteSlot = async (req: Request, res: Response): Promise<void> =>{
        try {
            const slotId = req.params["id"]

            const { response,status } = await this._slotService.deleteSlot(slotId)

            res.status(status).json(response)
        } catch (error) {
            console.error("error deleting slot:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                error: error instanceof Error ? error.message : "slot deletion failed",
            });
        }
    }
}