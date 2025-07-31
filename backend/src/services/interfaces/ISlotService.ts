import { MessageResponseDto, SlotCreateRequestDto, SlotListResponseDto, SlotReponseDto } from "../../dto/slot.dto";
import { ISlotRule } from "../../models/slots.model";

export interface ISlotService{
    getSlotRulesByBarber(barberId: string,page: number,limit: number): Promise<{response: SlotListResponseDto; status: number}>;
    createSlotRule(barberId: string,data: SlotCreateRequestDto): Promise<{ response: SlotReponseDto; message: string; status: number }>;
    updateSlotRule(slotId: string,data: SlotCreateRequestDto): Promise<{ response: SlotReponseDto; message: string; status: number }>
    deleteSlotRule(slotId: string):Promise<{response: MessageResponseDto; status: number}>;
}