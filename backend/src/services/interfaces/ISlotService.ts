import {  SlotResponseDto, SlotRuleCreateRequestDto, SlotRuleListResponseDto, SlotRuleReponseDto } from "../../dto/slot.dto";
import { MessageResponseDto } from "../../dto/base.dto";

export interface ISlotService{
    getSlotRulesByBarber(barberId: string,page: number,limit: number): Promise<{response: SlotRuleListResponseDto;}>;
    createSlotRule(barberId: string,data: SlotRuleCreateRequestDto): Promise<{ response: SlotRuleReponseDto; message: string;}>;
    updateSlotRule(slotId: string,data: SlotRuleCreateRequestDto): Promise<{ response: SlotRuleReponseDto; message: string;}>
    deleteSlotRule(slotId: string):Promise<{response: MessageResponseDto;}>;
    getPopulatedSlots(barberId:string,serviceId: string,date: string,page: number,limit: number):Promise<{response: SlotResponseDto}>
}