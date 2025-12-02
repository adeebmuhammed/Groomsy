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
exports.BarberController = void 0;
const constants_1 = require("../utils/constants");
const jwt_generator_1 = require("../utils/jwt.generator");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let BarberController = class BarberController {
    constructor(_barberService) {
        this._barberService = _barberService;
        this.signup = async (req, res) => {
            try {
                const { response } = await this._barberService.registerBarber(req.body);
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
                    error: error instanceof Error ? error.message : "Registration failed",
                });
            }
        };
        this.verifyOTP = async (req, res) => {
            try {
                const { email, otp, purpose } = req.body;
                const { response } = await this._barberService.verifyOTP(email, otp, purpose);
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
                    error: error instanceof Error ? error.message : "OTP Verification failed",
                });
            }
        };
        this.resendOTP = async (req, res) => {
            try {
                const { email, purpose } = req.body;
                const { response } = await this._barberService.resendOTP(email, purpose);
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
                    error: error instanceof Error ? error.message : "OTP resend failed",
                });
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                let { response } = await this._barberService.login(email, password);
                const refreshToken = (0, jwt_generator_1.generateRefreshToken)({
                    userId: response.id,
                    type: constants_1.ROLES.BARBER,
                });
                res.cookie("auth-token", response.token, {
                    httpOnly: process.env.AUTH_TOKEN_HTTP_ONLY === "true",
                    secure: process.env.AUTH_TOKEN_SECURE === "true",
                    sameSite: process.env.AUTH_TOKEN_SAME_SITE,
                    maxAge: Number(process.env.AUTH_TOKEN_MAX_AGE),
                });
                res.cookie("refresh-token", refreshToken, {
                    httpOnly: process.env.REFRESH_TOKEN_HTTP_ONLY === "true",
                    secure: process.env.REFRESH_TOKEN_SECURE === "true",
                    sameSite: process.env.REFRESH_TOKEN_SAME_SITE,
                    maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
                });
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
                    error: error instanceof Error ? error.message : "Login failed",
                });
            }
        };
        this.forgotPassword = async (req, res) => {
            try {
                const { email } = req.body;
                const { response } = await this._barberService.forgotPassword(email);
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
                    error: error instanceof Error ? error.message : "forgot password failed",
                });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { email, password, confirmPassword } = req.body;
                const { response } = await this._barberService.resetPassword(email, password, confirmPassword);
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
                    error: error instanceof Error ? error.message : "reset password failed",
                });
            }
        };
        this.logout = async (req, res) => {
            res.clearCookie("auth-token", { path: "/" });
            res.clearCookie("refresh-token", { path: "/" });
            res.status(constants_1.STATUS_CODES.OK).json({
                message: "Logged out successfully",
            });
        };
        this.getBarberProfileById = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const { response } = await this._barberService.getBarberProfileById(barberId);
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
                        : "Failed to fetch Barber Profile",
                });
            }
        };
        this.updateBarberProfile = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const data = req.body;
                const { response } = await this._barberService.updateBarberProfile(barberId, data);
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
                        : "Failed to Upadte Barber Profile",
                });
            }
        };
        this.updateBarberAddress = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const data = req.body;
                const { response } = await this._barberService.updateBarberAddress(barberId, data);
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
                        : "Failed to Update Barber Address",
                });
            }
        };
        this.fetchUsers = async (req, res) => {
            try {
                const search = req.query.search || "";
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                let status;
                const { response } = await this._barberService.fetchUsers(search, page, limit);
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
                    error: error instanceof Error ? error.message : "Fetching Users Failed",
                });
            }
        };
        this.getBarberDashboardStats = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const filterParam = req.query.filter;
                let status;
                const filter = filterParam === constants_1.DASHBOARDFILTERS.WEEK ||
                    filterParam === constants_1.DASHBOARDFILTERS.MONTH ||
                    filterParam === constants_1.DASHBOARDFILTERS.YEAR
                    ? filterParam
                    : constants_1.DASHBOARDFILTERS.WEEK;
                const { dashboardStats } = await this._barberService.getDashboardStats(barberId, filter);
                if (dashboardStats) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR;
                }
                res.status(status).json(dashboardStats);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to fetch Barber Dashboard stats",
                });
            }
        };
        this.updateProfilePicture = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const { profilePicUrl, profilePicKey } = req.body;
                const { profilePictureUpdation } = await this._barberService.updateBarberProfilePicture(barberId, profilePicUrl, profilePicKey);
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
                        : "Failed to Update Barber Profile Picture",
                });
            }
        };
        this.deleteProfilePicture = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const { profilePictureDeletion } = await this._barberService.deleteBarberProfilePicture(barberId);
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
                        : "Failed to Delete Barber Profile Picture",
                });
            }
        };
    }
};
exports.BarberController = BarberController;
exports.BarberController = BarberController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBarberService)),
    __metadata("design:paramtypes", [Object])
], BarberController);
