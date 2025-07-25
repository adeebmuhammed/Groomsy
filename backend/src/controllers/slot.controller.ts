import { Request, Response } from "express";
import { ISlotController } from "./interfaces/ISlotController";
import { SlotService } from "../services/slot.service";
import { STATUS_CODES } from "../utils/constants";

export class SlotController implements ISlotController{
    constructor(private _slotService: SlotService){}

    createSlot = async (req: Request, res: Response): Promise<void> =>{
        try {
            const barberId = req.query.barberId as string;
            const data = req.body

            const{ response,message,status } = await this._slotService.createSlot(barberId,data)

            res.status(status).json({ response,message})
        } catch (error) {
            console.error("error creating slot:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                error: error instanceof Error ? error.message : "slot creation failed",
            });
        }
    }
}