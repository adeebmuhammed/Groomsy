"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExpiryDate = void 0;
const calculateExpiryDate = (duration, unit) => {
    const expiry = new Date();
    if (unit === "month")
        expiry.setMonth(expiry.getMonth() + duration);
    if (unit === "year")
        expiry.setFullYear(expiry.getFullYear() + duration);
    if (unit === "day")
        expiry.setDate(expiry.getDate() + duration);
    return expiry;
};
exports.calculateExpiryDate = calculateExpiryDate;
