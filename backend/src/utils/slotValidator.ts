import { SlotCreateRequestDto } from "../dto/slot.dto";

export const validateSlotData = (data: SlotCreateRequestDto):string[] => {
    const errors = []

    if (!data.date || !data.startTime || !data.endTime || !data.price) {
        errors.push('Required fields: Date, start and end time, price')
    }

    const now =  new Date()

    if (data.date < now) {
        errors.push("Cannot create a slot with a past date")
    }

    if (data.startTime && data.endTime) {
        if (data.startTime >= data.endTime) {
            errors.push("Start time should be less than end time");
        }
    }

    if (data.price != null && data.price <= 0) {
        errors.push("Price should be a valid number greater than zero");
    }

    return errors
}