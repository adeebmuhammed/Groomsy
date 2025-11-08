"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOOKINGSTATUS = exports.USERSTATUS = exports.TABLEFILTERS = exports.DASHBOARDFILTERS = exports.REGEX = exports.MESSAGES = exports.STATUS_CODES = exports.ROLES = void 0;
var ROLES;
(function (ROLES) {
    ROLES["USER"] = "user";
    ROLES["BARBER"] = "barber";
    ROLES["ADMIN"] = "admin";
})(ROLES || (exports.ROLES = ROLES = {}));
exports.STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};
exports.MESSAGES = {
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
exports.REGEX = {
    EMAIL: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    LONG_NAME: /^[A-Za-z0-9 ]{1,25}$/,
    OTP: /^\d{6}$/,
    PHONE: /^[0-9]{10,15}$/,
};
var DASHBOARDFILTERS;
(function (DASHBOARDFILTERS) {
    DASHBOARDFILTERS["DAY"] = "1 Day";
    DASHBOARDFILTERS["WEEK"] = "1 Week";
    DASHBOARDFILTERS["MONTH"] = "1 Month";
    DASHBOARDFILTERS["YEAR"] = "1 Year";
})(DASHBOARDFILTERS || (exports.DASHBOARDFILTERS = DASHBOARDFILTERS = {}));
var TABLEFILTERS;
(function (TABLEFILTERS) {
    TABLEFILTERS["NEWEST"] = "newest";
    TABLEFILTERS["OLDEST"] = "oldest";
    TABLEFILTERS["PRICE_LOW"] = "price_low";
    TABLEFILTERS["PRICE_HIGH"] = "price_high";
})(TABLEFILTERS || (exports.TABLEFILTERS = TABLEFILTERS = {}));
var USERSTATUS;
(function (USERSTATUS) {
    USERSTATUS["ACTIVE"] = "active";
    USERSTATUS["BLOCKED"] = "blocked";
})(USERSTATUS || (exports.USERSTATUS = USERSTATUS = {}));
var BOOKINGSTATUS;
(function (BOOKINGSTATUS) {
    BOOKINGSTATUS["STAGED"] = "staged";
    BOOKINGSTATUS["PENDING"] = "pending";
    BOOKINGSTATUS["CANCELLED_BY_BARBER"] = "cancelled_by_barber";
    BOOKINGSTATUS["CANCELLED_BY_USER"] = "cancelled_by_user";
    BOOKINGSTATUS["FINISHED"] = "finished";
    BOOKINGSTATUS["CANCELLED"] = "cancelled";
})(BOOKINGSTATUS || (exports.BOOKINGSTATUS = BOOKINGSTATUS = {}));
