import { SlotCreateRequestDto } from "../dto/slot.dto";

export const validateSlotData = (data: SlotCreateRequestDto): string[] => {
  const errors: string[] = [];

  if (!data || !Array.isArray(data.slots) || data.slots.length === 0) {
    errors.push("At least one slot (day, startTime, endTime) is required.");
  }

  if (data.price == null || data.price <= 0) {
    errors.push("Price should be a valid number greater than zero.");
  }

  if (!data.duration || !["30m", "1h", "1h 30m", "2"].includes(data.duration)) {
    errors.push("Duration must be one of: 30m, 1h, 1h 30m, 2");
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

    if (start < now) {
      errors.push(`Start time for day ${slot.day} is in the past.`);
    }
  }

  return errors;
};
