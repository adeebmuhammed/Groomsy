"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotMapper = void 0;
class SlotMapper {
    static toSlotResponse(data) {
        return {
            id: data._id.toString(),
            slots: data.slots.map((slot) => ({
                day: slot.day,
                startTime: slot.startTime,
                endTime: slot.endTime
            }))
        };
    }
    static toSlotDtoArray(slots) {
        return slots.map(slot => SlotMapper.toSlotResponse(slot));
    }
}
exports.SlotMapper = SlotMapper;
