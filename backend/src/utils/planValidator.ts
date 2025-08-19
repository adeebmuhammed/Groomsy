import { CreateSubscriptionPlanDto } from "../dto/subscription.plan.dto";

export const validatePlanData = (data: CreateSubscriptionPlanDto):string[] => {
    const errors = []

    if (!data.name  || !data.price || !data.renewalPrice || !data.duration || !data.durationUnit || !data.description ) {
        errors.push('Required fields: name, price, renewal price, duration ,duration unit and description')
    }
    if (data.price != null && data.price <= 0) {
        errors.push("price should be a valid number greater than zero");
    }

    if (data.renewalPrice != null && data.renewalPrice <= 0) {
        errors.push("renewal price should be a valid number greater than zero");
    }

    if (data.duration <= 0) {
        errors.push("duration should be a valid number greater than zero");
    }

    const units = [ "day", "month", "year" ]
    if (!units.includes(data.durationUnit)) {
        errors.push("invalid duration unit")
    }

    return errors
}