import { SlotCreateRequestDto, SlotReponseDto } from "../../dto/slot.dto";
import { ISlot } from "../../models/slots.model";

export interface ISlotService{
    createSlot(barberId: string,data: SlotCreateRequestDto): Promise<{ response: SlotReponseDto; message: string; status: number }>;
}