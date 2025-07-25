import { SlotCreateRequestDto } from "../dto/slot.dto";

export const validateSlotData = (data: SlotCreateRequestDto):string[] => {
    const errors = []

    if (!data.date) {
        errors.push('Date is Required')
    }

    if (!data.startTime || !data.endTime) {
        errors.push("Start time and end time is required")
    }

    if (!data.price) {
        errors.push("price is required")
    }

    return errors
}