import { SlotResponseDto, SlotTimeDto } from "../dto/slot.dto";
import { ISlotRule } from "../models/slots.model";

export const generateSlotsFromRules = (
  rules: ISlotRule[],
  startDate: Date,
  endDate: Date,
  duration: string,
  price?: number
): SlotResponseDto => {
  const dayMap: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  function combineDateAndTimeIST(date: Date, timeStr: string): Date {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      0,
      0
    );
  }


  const result: { [date: string]: SlotTimeDto[] } = {};
  const durationMinutes = parseDuration(duration); // e.g. "30m" -> 30

  for (const rule of rules) {
    for (const slot of rule.slots) {
      const slotDay = dayMap[slot.day];

      let current = new Date(startDate);
      while (current <= endDate) {
        if (current.getDay() === slotDay) {
          const dateStr = current.toISOString().split("T")[0];

          const dayStart = combineDateAndTimeIST(current, slot.startTime);
const dayEnd = combineDateAndTimeIST(current, slot.endTime);


          if (!result[dateStr]) {
            result[dateStr] = [];
          }

          let start = new Date(dayStart);
          while (start.getTime() + durationMinutes * 60000 <= dayEnd.getTime()) {
            const end = new Date(start.getTime() + durationMinutes * 60000);

            result[dateStr].push({
              startTime: start,
              endTime: end,
            });

            start = end;
          }
        }
        current.setDate(current.getDate() + 1);
      }
    }
  }

  return result;
};


const parseDuration = (duration: string): number => {
  const parts = duration.match(/(\d+h)?\s*(\d+m)?/);
  let minutes = 0;
  if (parts?.[1]) minutes += parseInt(parts[1]) * 60;
  if (parts?.[2]) minutes += parseInt(parts[2]);
  return minutes;
};
