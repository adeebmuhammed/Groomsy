import { REGEX } from "./constants";

export const isValidEmail = (email: string): boolean => {
  const emailRegex = REGEX.EMAIL;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  const passwordRegex = REGEX.PASSWORD;
  return passwordRegex.test(password);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = REGEX.PHONE;
  return phoneRegex.test(phone);
};

export const isValidOTP = (otp: string): boolean => {
  const otpRegex = REGEX.OTP;
  return otpRegex.test(otp);
};