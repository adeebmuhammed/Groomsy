import { MessageResponseDto, SlotCreateRequestDto, SlotReponseDto } from "../../dto/slot.dto";
import { ISlot } from "../../models/slots.model";

export interface ISlotService{
    createSlot(barberId: string,data: SlotCreateRequestDto): Promise<{ response: SlotReponseDto; message: string; status: number }>;
    updateSlot(slotId: string,data: SlotCreateRequestDto): Promise<{ response: SlotReponseDto; message: string; status: number }>
    deleteSlot(slotId: string):Promise<{response: MessageResponseDto; status: number}>;
}