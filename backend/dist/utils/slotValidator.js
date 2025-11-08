"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSlotData = void 0;
exports.toUTCTimeOnly = toUTCTimeOnly;
exports.isOverlapping = isOverlapping;
const validateSlotData = (data) => {
    const errors = [];
    if (!data || !Array.isArray(data.slots) || data.slots.length === 0) {
        errors.push("At least one slot (day, startTime, endTime) is required.");
    }
    for (const slot of data.slots) {
        if (!slot.day || !slot.startTime || !slot.endTime) {
            errors.push("Each slot must include day, startTime, and endTime.");
            continue;
        }
        const start = toUTCTimeOnly(slot.startTime);
        const end = toUTCTimeOnly(slot.endTime);
        if (start >= end) {
            errors.push(`Start time must be before end time for day: ${slot.day}`);
        }
    }
    return errors;
};
exports.validateSlotData = validateSlotData;
function toUTCTimeOnly(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return new Date(Date.UTC(1970, 0, 1, hours, minutes));
}
function isOverlapping(start1, end1, start2, end2) {
    const s1 = new Date(`1970-01-01T${start1}:00Z`).getTime();
    const e1 = new Date(`1970-01-01T${end1}:00Z`).getTime();
    const s2 = new Date(`1970-01-01T${start2}:00Z`).getTime();
    const e2 = new Date(`1970-01-01T${end2}:00Z`).getTime();
    return s1 < e2 && s2 < e1; // overlap if ranges intersect
}
