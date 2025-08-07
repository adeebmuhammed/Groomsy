import { MessageResponseDto } from "../../dto/base.dto";

export interface IBarberUnavailabilityService{
    editWeeklyDayOff(barberId: string, day: string): Promise<{response: MessageResponseDto, status: number}>
}