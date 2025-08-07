export interface BarberUnavailabilityDto {
  id: string;
  barber: string;
  weeklyOff: string;
  specialOffDays: { date: string; reason?: string }[];
}