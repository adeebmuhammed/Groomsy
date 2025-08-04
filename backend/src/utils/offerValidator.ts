import { CreateOfferDto } from "../dto/offer.dto";

export const validateOfferData = (data: CreateOfferDto):string[] => {
    const errors = []

    if (!data.name  || !data.discount || !data.startDate || !data.endDate ) {
        errors.push('Required fields: name, discount, start date, end date')
    }

    const now =  new Date()

    if (data.startDate && data.endDate) {
        if (data.startDate >= data.endDate) {
            errors.push("Start date should be less than end date");
        }
    }

    if (data.discount != null && data.discount <= 0) {
        errors.push("discount should be a valid number greater than zero");
    }

    return errors
}