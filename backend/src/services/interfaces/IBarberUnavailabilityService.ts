import { BarberUnavailabilityDto } from "../../dto/barber.unavailability.dto";
import { MessageResponseDto } from "../../dto/base.dto";

export interface IBarberUnavailabilityService{
    fetchBarberUnavailability(barberId: string): Promise<{response: BarberUnavailabilityDto, status: number}>
    editWeeklyDayOff(barberId: string, day: string): Promise<{response: MessageResponseDto, status: number}>
    addOffDay(barberId: string, data: {date: string, reason: string}): Promise<{response: MessageResponseDto, status: number}>
    removeOffDay(barberId: string, date: string): Promise<{response: MessageResponseDto, status: number}>
}