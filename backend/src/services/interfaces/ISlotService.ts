import {  SlotResponseDto, SlotRuleCreateRequestDto, SlotRuleListResponseDto, SlotRuleReponseDto } from "../../dto/slot.dto";
import { ISlotRule } from "../../models/slots.model";
import { MessageResponseDto } from "../../dto/base.dto";

export interface ISlotService{
    getSlotRulesByBarber(barberId: string,page: number,limit: number): Promise<{response: SlotRuleListResponseDto; status: number}>;
    createSlotRule(barberId: string,data: SlotRuleCreateRequestDto): Promise<{ response: SlotRuleReponseDto; message: string; status: number }>;
    updateSlotRule(slotId: string,data: SlotRuleCreateRequestDto): Promise<{ response: SlotRuleReponseDto; message: string; status: number }>
    deleteSlotRule(slotId: string):Promise<{response: MessageResponseDto; status: number}>;
    getPopulatedSlots(barberId:string,serviceId: string,date: string,page: number,limit: number):Promise<{response: SlotResponseDto, status: number}>
}