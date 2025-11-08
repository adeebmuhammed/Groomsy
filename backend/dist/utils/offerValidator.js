"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOfferData = void 0;
const validators_1 = require("./validators");
const validateOfferData = (data) => {
    const errors = [];
    if (!data.name || !data.discount || !data.startDate || !data.endDate) {
        errors.push('Required fields: name, discount, start date, end date');
    }
    if (!(0, validators_1.isValidName)(data.name)) {
        errors.push("invalid name");
    }
    if (data.startDate && data.endDate) {
        if (data.startDate >= data.endDate) {
            errors.push("Start date should be less than end date");
        }
    }
    if (data.discount != null && data.discount <= 0) {
        errors.push("discount should be a valid number greater than zero");
    }
    return errors;
};
exports.validateOfferData = validateOfferData;
