"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const constants_1 = require("../utils/constants");
const jwt_generator_1 = require("../utils/jwt.generator");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let UserController = class UserController {
    constructor(_userService) {
        this._userService = _userService;
        this.register = async (req, res) => {
            try {
                const { response } = await this._userService.registerUser(req.body);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json({
                    response,
                });
            }
            catch (error) {
                console.error("Registration error:", error);
                res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({
                    error: error instanceof Error ? error.message : "Registration failed",
                });
            }
        };
        this.verifyOTP = async (req, res) => {
            try {
                const { email, otp, purpose } = req.body; // get purpose from frontend
                const { response } = await this._userService.verifyOTP(email, otp, purpose);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error("OTP verification error:", error);
                res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({
                    error: error instanceof Error ? error.message : "OTP verification failed",
                });
            }
        };
        this.resendOTP = async (req, res) => {
            try {
                const { email, purpose } = req.body;
                if (!email || !purpose) {
                    res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({
                        error: "Email and purpose are required",
                    });
                    return;
                }
                const { response } = await this._userService.resendOTP(email, purpose);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error("OTP resend error:", error);
                res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({
                    error: error instanceof Error ? error.message : "Failed to resend OTP",
                });
            }
        };
        this.googleCallback = async (req, res) => {
            try {
                const user = req.user;
                const { response } = await this._userService.processGoogleAuth(user);
                const accessToken = (0, jwt_generator_1.generateAccessToken)({
                    userId: response.id,
                    type: constants_1.ROLES.USER,
                });
                const refreshToken = (0, jwt_generator_1.generateRefreshToken)({
                    userId: response.id,
                    type: constants_1.ROLES.USER,
                });
                res.cookie("auth-token", accessToken, {
                    httpOnly: process.env.AUTH_TOKEN_HTTP_ONLY === "true",
                    secure: process.env.AUTH_TOKEN_SECURE === "true",
                    sameSite: "lax",
                    maxAge: Number(process.env.AUTH_TOKEN_MAX_AGE),
                });
                res.cookie("refresh-token", refreshToken, {
                    httpOnly: process.env.REFRESH_TOKEN_HTTP_ONLY === "true",
                    secure: process.env.REFRESH_TOKEN_SECURE === "true",
                    sameSite: "strict",
                    maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
                });
                res.redirect(`${process.env.FRONTEND_URL}/user/auth-callback?token=${accessToken}&name=${encodeURIComponent(response.name)}&id=${encodeURIComponent(response.id)}`);
            }
            catch (error) {
                console.error("Google auth error:", error);
                res.redirect(`${process.env.FRONTEND_URL}/user/signup?error=google_auth_failed`);
            }
        };
        this.logout = async (req, res) => {
            res.clearCookie("auth-token", { path: "/" });
            res.clearCookie("refresh-token", { path: "/" });
            res.status(constants_1.STATUS_CODES.OK).json({
                message: "Logged out successfully",
            });
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const { response } = await this._userService.loginUser(email, password);
                const accessToken = (0, jwt_generator_1.generateAccessToken)({
                    userId: response.id,
                    type: constants_1.ROLES.USER,
                });
                const refreshToken = (0, jwt_generator_1.generateRefreshToken)({
                    userId: response.id,
                    type: constants_1.ROLES.USER,
                });
                res.cookie("auth-token", accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 60 * 60 * 1000, // 1 hour
                });
                res.cookie("refresh-token", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json({
                    message: response.message,
                    user: {
                        id: response.id,
                        name: response.name,
                        email: response.email,
                        phone: response.phone,
                        status: response.status,
                        token: accessToken,
                    },
                });
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.UNAUTHORIZED).json({
                    error: error instanceof Error ? error.message : "Login Failed",
                });
            }
        };
        this.forgotPassword = async (req, res) => {
            try {
                const { email } = req.body;
                const { response } = await this._userService.forgotPassword(email);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error("Forgot password error:", error);
                res.status(constants_1.STATUS_CODES.BAD_REQUEST).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to process forgot password request",
                });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { email, password, confirmPassword } = req.body;
                const { response } = await this._userService.resetPassword(email, password, confirmPassword);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to reset password",
                });
            }
        };
        this.fetchAllBarbers = async (req, res) => {
            try {
                const search = req.query.search || "";
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 3;
                const district = req.query.district || "";
                const { response } = await this._userService.fetchAllBarbers(search, page, limit, district);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to fetch barbers",
                });
            }
        };
        this.fetchBarbersAndSlotRules = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const { response } = await this._userService.fetchBarbersAndSlotRules(page, limit, barberId);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to fetch slots and barber",
                });
            }
        };
        this.fetchBarberDetailsById = async (req, res) => {
            try {
                const barberId = req.params["id"];
                const { barberDetailsData } = await this._userService.fetchBarberDetailsById(barberId);
                let status;
                if (barberDetailsData) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
                }
                res.status(status).json(barberDetailsData);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to barber details",
                });
            }
        };
        this.getUserProfileById = async (req, res) => {
            try {
                const userId = req.params["id"];
                const { response } = await this._userService.getUserProfileById(userId);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to fetch User Profile",
                });
            }
        };
        this.updateUserProfile = async (req, res) => {
            try {
                const userId = req.params["id"];
                const data = req.body;
                const { response } = await this._userService.updateUserProfile(userId, data);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to edit User Profile",
                });
            }
        };
        this.updateProfilePicture = async (req, res) => {
            try {
                const userId = req.params["id"];
                const { profilePicUrl, profilePicKey } = req.body;
                const { profilePictureUpdation } = await this._userService.updateUserProfilePicture(userId, profilePicUrl, profilePicKey);
                let status;
                if (profilePictureUpdation) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
                }
                res.status(status).json(profilePictureUpdation);
            }
            catch (error) {
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to Update User Profile Picture",
                });
            }
        };
        this.deleteProfilePicture = async (req, res) => {
            try {
                const userId = req.params["id"];
                const { profilePictureDeletion } = await this._userService.deleteUserProfilePicture(userId);
                let status;
                if (profilePictureDeletion) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
                }
                res.status(status).json(profilePictureDeletion);
            }
            catch (error) {
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to Delete User Profile Picture",
                });
            }
        };
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserService)),
    __metadata("design:paramtypes", [Object])
], UserController);
