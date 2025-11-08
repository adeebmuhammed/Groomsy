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
exports.AdminController = void 0;
const constants_1 = require("../utils/constants");
const jwt_generator_1 = require("../utils/jwt.generator");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let AdminController = class AdminController {
    constructor(_adminService) {
        this._adminService = _adminService;
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const result = await this._adminService.loginAdmin(email, password);
                const accessToken = (0, jwt_generator_1.generateAccessToken)({
                    userId: result.response.id,
                    type: constants_1.ROLES.ADMIN,
                });
                const refreshToken = (0, jwt_generator_1.generateRefreshToken)({
                    userId: result.response.id,
                    type: constants_1.ROLES.ADMIN,
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
                res.status(constants_1.STATUS_CODES.OK).json({
                    message: result.response.message,
                    token: accessToken,
                    user: {
                        id: result.response.id,
                        name: result.response.name,
                        email: result.response.email,
                    },
                    role: constants_1.ROLES.ADMIN,
                });
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.UNAUTHORIZED).json({
                    error: error instanceof Error ? error.message : "Login Failed",
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
        this.listUsers = async (req, res) => {
            try {
                const search = req.query.search || "";
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                let status;
                const { response } = await this._adminService.listUsers(search, page, limit);
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
        this.listBarbers = async (req, res) => {
            try {
                const search = req.query.search || "";
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                let status;
                const { response } = await this._adminService.listBarbers(search, page, limit);
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
                    error: error instanceof Error ? error.message : "Fetching Barbers Failed",
                });
            }
        };
        this.updateUserStatus = async (req, res) => {
            try {
                const { id: userId } = req.params;
                const { status } = req.body;
                let statusCode;
                let result;
                if (status === constants_1.USERSTATUS.ACTIVE) {
                    result = await this._adminService.blockUser(userId);
                }
                else if (status === constants_1.USERSTATUS.BLOCKED) {
                    result = await this._adminService.unBlockUser(userId);
                }
                else {
                    throw new Error("Invalid status");
                }
                if (result) {
                    statusCode = constants_1.STATUS_CODES.OK;
                }
                else {
                    statusCode = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(statusCode).json({
                    message: result.message,
                    user: result.response,
                });
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "user status update Failed",
                });
            }
        };
        this.updateBarberStatus = async (req, res) => {
            try {
                const { id: barberId } = req.params;
                const { status } = req.body;
                let statusCode;
                let result;
                if (status === constants_1.USERSTATUS.ACTIVE) {
                    result = await this._adminService.blockBarber(barberId);
                }
                else if (status === constants_1.USERSTATUS.BLOCKED) {
                    result = await this._adminService.unBlockBarber(barberId);
                }
                else {
                    throw new Error("Invalid status");
                }
                if (result) {
                    statusCode = constants_1.STATUS_CODES.OK;
                }
                else {
                    statusCode = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(statusCode).json({
                    message: result.message,
                    barber: result.response,
                });
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "barber status update Failed",
                });
            }
        };
        this.getAdminDashboardStats = async (req, res) => {
            try {
                const filterParam = req.query.filter;
                const filter = filterParam === constants_1.DASHBOARDFILTERS.WEEK ||
                    filterParam === constants_1.DASHBOARDFILTERS.MONTH ||
                    filterParam === constants_1.DASHBOARDFILTERS.YEAR
                    ? filterParam
                    : constants_1.DASHBOARDFILTERS.WEEK;
                const { dashboardStats } = await this._adminService.getAdminDashboardStats(filter);
                let status;
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
                        : "Failed to load dashboard stats",
                });
            }
        };
    }
};
exports.AdminController = AdminController;
exports.AdminController = AdminController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IAdminService)),
    __metadata("design:paramtypes", [Object])
], AdminController);
