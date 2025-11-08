"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidName = exports.isValidOTP = exports.isValidPhone = exports.isValidPassword = exports.isValidEmail = void 0;
const constants_1 = require("./constants");
const isValidEmail = (email) => {
    const emailRegex = constants_1.REGEX.EMAIL;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPassword = (password) => {
    const passwordRegex = constants_1.REGEX.PASSWORD;
    return passwordRegex.test(password);
};
exports.isValidPassword = isValidPassword;
const isValidPhone = (phone) => {
    const phoneRegex = constants_1.REGEX.PHONE;
    return phoneRegex.test(phone);
};
exports.isValidPhone = isValidPhone;
const isValidOTP = (otp) => {
    const otpRegex = constants_1.REGEX.OTP;
    return otpRegex.test(otp);
};
exports.isValidOTP = isValidOTP;
const isValidName = (name) => {
    const nameRegex = constants_1.REGEX.LONG_NAME;
    return nameRegex.test(name);
};
exports.isValidName = isValidName;
