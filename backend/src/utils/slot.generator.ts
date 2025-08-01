import { ISlotRule } from "../models/slots.model";

export const generateSlotsFromRules = (
  rules: ISlotRule[],
  startDate: Date,   // e.g., start of current week
  endDate: Date      // e.g., end of current week
): { [date: string]: { startTime: Date; endTime: Date }[] } => {
  const dayMap: { [key: string]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const result: { [date: string]: { startTime: Date; endTime: Date }[] } = {};

  for (const rule of rules) {
    for (const slot of rule.slots) {
      const slotDay = dayMap[slot.day];

      // Generate all dates in the range that match the slot day
      let current = new Date(startDate);
      while (current <= endDate) {
        if (current.getDay() === slotDay) {
          const dateStr = current.toISOString().split('T')[0];

          // Calculate time slots between startTime and endTime using rule.duration
          const dayStart = new Date(current);
          dayStart.setHours(slot.startTime.getHours(), slot.startTime.getMinutes(), 0, 0);

          const dayEnd = new Date(current);
          dayEnd.setHours(slot.endTime.getHours(), slot.endTime.getMinutes(), 0, 0);

          let durationMinutes = parseDuration(rule.duration); // helper to convert '1h 30m' -> 90
          const slotsForDay: { startTime: Date; endTime: Date }[] = [];

          let tempStart = new Date(dayStart);
          while (tempStart < dayEnd) {
            const tempEnd = new Date(tempStart.getTime() + durationMinutes * 60000);
            if (tempEnd <= dayEnd) {
              slotsForDay.push({ startTime: new Date(tempStart), endTime: tempEnd });
            }
            tempStart = tempEnd;
          }

          if (!result[dateStr]) {
            result[dateStr] = [];
          }
          result[dateStr].push(...slotsForDay);
        }

        // Move to next day
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