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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../utils/constants");
const validators_1 = require("../utils/validators");
const admin_mapper_1 = require("../mappers/admin.mapper");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const user_mapper_1 = require("../mappers/user.mapper");
let AdminService = class AdminService {
    constructor(_adminRepo, _userRepo, _barberRepo, _bookingRepo) {
        this._adminRepo = _adminRepo;
        this._userRepo = _userRepo;
        this._barberRepo = _barberRepo;
        this._bookingRepo = _bookingRepo;
        this.loginAdmin = async (email, password) => {
            if (!(0, validators_1.isValidEmail)(email)) {
                throw new Error("invalid email format");
            }
            if (!password) {
                throw new Error("password is required");
            }
            const admin = await this._adminRepo.findByEmail(email);
            if (!admin) {
                throw new Error(constants_1.MESSAGES.ERROR.INVALID_CREDENTIALS);
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, admin.password);
            if (!isPasswordValid) {
                throw new Error(constants_1.MESSAGES.ERROR.INVALID_CREDENTIALS);
            }
            return {
                response: admin_mapper_1.AdminMapper.toLoginResponse(admin, constants_1.MESSAGES.SUCCESS.LOGIN),
            };
        };
        this.listUsers = async (search, page, limit) => {
            const { users, totalCount } = await this._userRepo.findBySearchTerm(search, page, limit);
            const response = {
                data: user_mapper_1.UserMapper.toUserDtoArray(users),
                message: "Users fetched successfully",
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit,
                },
            };
            return {
                response,
            };
        };
        this.listBarbers = async (search, page, limit) => {
            const { barbers, totalCount } = await this._barberRepo.findBySearchTerm(search, page, limit, "");
            const response = {
                data: admin_mapper_1.AdminMapper.toBarberDtoArray(barbers),
                message: "Barbers fetched successfully",
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit,
                },
            };
            return {
                response,
            };
        };
        this.blockUser = async (userId) => {
            const user = await this._userRepo.findById(userId);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (user.status === constants_1.USERSTATUS.BLOCKED)
                throw new Error("User already blocked");
            const updatedUser = await this._userRepo.update(userId, {
                status: constants_1.USERSTATUS.BLOCKED,
            });
            if (!updatedUser)
                throw new Error("Could not block user");
            const response = user_mapper_1.UserMapper.toUserDto(updatedUser);
            return {
                message: constants_1.MESSAGES.SUCCESS.USER_BLOCKED,
                response,
            };
        };
        this.unBlockUser = async (userId) => {
            const user = await this._userRepo.findById(userId);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (user.status === constants_1.USERSTATUS.ACTIVE)
                throw new Error("User already active");
            const updatedUser = await this._userRepo.update(userId, {
                status: constants_1.USERSTATUS.ACTIVE,
            });
            if (!updatedUser)
                throw new Error("Could not unblock user");
            const response = user_mapper_1.UserMapper.toUserDto(updatedUser);
            return {
                message: constants_1.MESSAGES.SUCCESS.USER_UNBLOCKED,
                response,
            };
        };
        this.blockBarber = async (barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            if (barber.status === constants_1.USERSTATUS.BLOCKED)
                throw new Error("barber already blocked");
            const updatedBarber = await this._barberRepo.update(barberId, {
                status: constants_1.USERSTATUS.BLOCKED,
            });
            if (!updatedBarber)
                throw new Error("Could not block barber");
            const response = admin_mapper_1.AdminMapper.toBarberDto(updatedBarber);
            return {
                message: constants_1.MESSAGES.SUCCESS.USER_BLOCKED,
                response,
            };
        };
        this.unBlockBarber = async (barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (barber.status === constants_1.USERSTATUS.ACTIVE)
                throw new Error("barber already active");
            const updatedBarber = await this._barberRepo.update(barberId, {
                status: constants_1.USERSTATUS.ACTIVE,
            });
            if (!updatedBarber)
                throw new Error("Could not unblock barber");
            const response = admin_mapper_1.AdminMapper.toBarberDto(updatedBarber);
            return {
                message: constants_1.MESSAGES.SUCCESS.USER_UNBLOCKED,
                response,
            };
        };
        this.getAdminDashboardStats = async (filter) => {
            const dashboardStats = await this._bookingRepo.getDashboardStats(filter);
            return { dashboardStats };
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IAdminRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBarberRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AdminService);
