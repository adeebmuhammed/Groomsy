export enum ROLES {
  USER = "user",
  BARBER = "barber",
  ADMIN = "admin",
}

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const MESSAGES = {
  SUCCESS: {
    SIGNUP: "Signup successful. Please verify your email.",
    LOGIN: "Login successful",
    LOGOUT: "Logout successful",
    OTP_SENT: "OTP sent to your email",
    OTP_VERIFIED: "OTP verified successfully",
    OTP_RESENT: "OTP resent successfully",
    PASSWORD_RESET: "Password reset successful",
    PASSWORD_UPDATED: "Password changed successfully.",
    BARBER_BLOCKED: "Barber blocked successfully",
    BARBER_UNBLOCKED: "Barber unblocked successfully",
    USER_BLOCKED: "User blocked successfully",
    USER_UNBLOCKED: "User unblocked successfully",
  },
  ERROR: {
    INVALID_CREDENTIALS: "Invalid credentials",
    EMAIL_EXISTS: "Email already exists",
    USER_NOT_FOUND: "User not found",
    BARBER_NOT_FOUND: "Barber not found",
    INVALID_INPUT: "Invalid input: Email and Password are required",
    PASSWORD_MISMATCH: "Password and Confirm Password do not match",
    PROFILE_UPDATE_FAILED: "Profile update failed.",
    JWT_SECRET_MISSING: "JWT secret is not configured",
    OTP_INVALID: "Invalid OTP",
    OTP_EXPIRED: "OTP has expired",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden access",
    SERVER_ERROR: "Internal server error",
    MISSING_FIELDS: "Required fields are missing",
    INVALID_TOKEN: "Invalid or expired token",
    ALREADY_VERIFIED: "User is already verified",
    BLOCKED: "You have been blocked by the admin",
    INVALID_EMAIL: "Invalid Email Format",
  },
};

export const REGEX = {
  EMAIL: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  PASSWORD:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
  LONG_NAME: /^[A-Za-z0-9 ]{1,25}$/,
  OTP: /^\d{6}$/,
  PHONE: /^[0-9]{10,15}$/,
};

export enum DASHBOARDFILTERS {
  DAY = "1 Day",
  WEEK = "1 Week",
  MONTH = "1 Month",
  YEAR = "1 Year"
}

export enum TABLEFILTERS {
  NEWEST = "newest",
  OLDEST = "oldest",
  PRICE_LOW = "price_low",
  PRICE_HIGH = "price_high"
}

export type SortOrder = 1 | -1;

export type BookingSortOptions = {
  createdAt?: SortOrder;
  totalPrice?: SortOrder;
};