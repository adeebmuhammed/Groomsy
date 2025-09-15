import { SlotRuleCreateRequestDto } from "../dto/slot.dto";

export const validateSlotData = (data: SlotRuleCreateRequestDto): string[] => {
  const errors: string[] = [];

  if (!data || !Array.isArray(data.slots) || data.slots.length === 0) {
    errors.push("At least one slot (day, startTime, endTime) is required.");
  }

  const now = new Date();

  for (const slot of data.slots) {
    if (!slot.day || !slot.startTime || !slot.endTime) {
      errors.push("Each slot must include day, startTime, and endTime.");
      continue;
    }

    const start = new Date(slot.startTime);
    const end = new Date(slot.endTime);

    if (start >= end) {
      errors.push(`Start time must be before end time for day: ${slot.day}`);
    }
  }

  return errors;
};

export function toUTCTimeOnly(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(Date.UTC(1970, 0, 1, hours, minutes));
  return date;
}

export function isOverlapping(start1: string, end1: string, start2: string, end2: string): boolean {
  const s1 = new Date(`1970-01-01T${start1}:00Z`).getTime();
  const e1 = new Date(`1970-01-01T${end1}:00Z`).getTime();
  const s2 = new Date(`1970-01-01T${start2}:00Z`).getTime();
  const e2 = new Date(`1970-01-01T${end2}:00Z`).getTime();

  return s1 < e2 && s2 < e1; // overlap if ranges intersect
}