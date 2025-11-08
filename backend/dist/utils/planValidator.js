"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePlanData = void 0;
const validators_1 = require("./validators");
const validatePlanData = (data) => {
    const errors = [];
    if (!data.name ||
        !data.price ||
        !data.renewalPrice ||
        !data.duration ||
        !data.durationUnit ||
        !data.description) {
        errors.push("Required fields: name, price, renewal price, duration ,duration unit and description");
    }
    if (!(0, validators_1.isValidName)(data.name)) {
        errors.push("invalid name");
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
    const units = ["day", "month", "year"];
    if (!units.includes(data.durationUnit)) {
        errors.push("invalid duration unit");
    }
    const validFeatures = [
        "Dashboard",
        "Slots",
        "Bookings",
        "Unavailability",
    ];
    if (data.features && !Array.isArray(data.features)) {
        errors.push("features must be an array of strings");
    }
    else if (data.features) {
        for (const feature of data.features) {
            if (!validFeatures.includes(feature)) {
                errors.push(`invalid feature: ${feature}`);
            }
        }
    }
    return errors;
};
exports.validatePlanData = validatePlanData;
