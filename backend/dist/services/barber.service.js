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
exports.BarberService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const validators_1 = require("../utils/validators");
const constants_1 = require("../utils/constants");
const OTPService_1 = __importDefault(require("../utils/OTPService"));
const barber_mapper_1 = require("../mappers/barber.mapper");
const jwt_generator_1 = require("../utils/jwt.generator");
const mongoose_1 = __importDefault(require("mongoose"));
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const user_mapper_1 = require("../mappers/user.mapper");
const s3_operataions_1 = require("../utils/s3.operataions");
let BarberService = class BarberService {
    constructor(_barberRepo, _barberUnavailabilityRepo, _bookingRepo, _userRepo, _otpRepo) {
        this._barberRepo = _barberRepo;
        this._barberUnavailabilityRepo = _barberUnavailabilityRepo;
        this._bookingRepo = _bookingRepo;
        this._userRepo = _userRepo;
        this._otpRepo = _otpRepo;
        this.registerBarber = async (barberData) => {
            const { name, email, phone, district, password } = barberData;
            if (!name || !email || !email || !phone || !district || !password) {
                throw new Error(constants_1.MESSAGES.ERROR.INVALID_INPUT);
            }
            if (!(0, validators_1.isValidEmail)(email)) {
                throw new Error("Invalid Email Format");
            }
            if (!(0, validators_1.isValidPhone)(phone)) {
                throw new Error("Invalid Phone Number Format");
            }
            if (!(0, validators_1.isValidPassword)(password)) {
                throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
            }
            const existingBarber = await this._barberRepo.findByEmail(email);
            if (existingBarber) {
                throw new Error(constants_1.MESSAGES.ERROR.EMAIL_EXISTS);
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const otp = OTPService_1.default.generateOTP();
            await OTPService_1.default.sendOTP(email, otp);
            console.log(otp);
            const newBarber = await this._barberRepo.create({
                ...barberData,
                password: hashedPassword,
                isVerified: false,
            });
            const otpCreated = await this._otpRepo.create({
                otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                role: constants_1.ROLES.BARBER,
                userId: newBarber._id,
            });
            if (!otpCreated) {
                throw new Error("otp generation failed");
            }
            await this._barberUnavailabilityRepo.create({
                barber: new mongoose_1.default.Types.ObjectId(newBarber._id.toString()),
                weeklyOff: "Sunday",
            });
            return {
                response: { message: constants_1.MESSAGES.SUCCESS.SIGNUP },
            };
        };
        this.verifyOTP = async (email, otp, purpose) => {
            if (!(0, validators_1.isValidOTP)(otp)) {
                throw new Error(constants_1.MESSAGES.ERROR.OTP_INVALID);
            }
            const barber = await this._barberRepo.findByEmail(email);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const otpGenerated = await this._otpRepo.findOne({ userId: barber._id });
            if (!otpGenerated) {
                throw new Error("otp expired");
            }
            if (otpGenerated.otp !== otp) {
                throw new Error(constants_1.MESSAGES.ERROR.OTP_INVALID);
            }
            if (purpose === "signup") {
                barber.isVerified = true;
            }
            await this._barberRepo.update(barber._id.toString(), barber);
            return {
                response: {
                    message: constants_1.MESSAGES.SUCCESS.OTP_VERIFIED,
                    barber: {
                        name: barber.name,
                        email: barber.email,
                    },
                },
            };
        };
        this.resendOTP = async (email, purpose) => {
            const barber = await this._barberRepo.findByEmail(email);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (purpose === "signup" && barber.isVerified) {
                throw new Error(constants_1.MESSAGES.ERROR.ALREADY_VERIFIED);
            }
            const newOTP = OTPService_1.default.generateOTP();
            await OTPService_1.default.sendOTP(email, newOTP);
            console.log(newOTP);
            const alreadyExistingOtp = await this._otpRepo.findOne({
                userId: barber._id,
            });
            let otpCreated;
            if (!alreadyExistingOtp) {
                otpCreated = await this._otpRepo.create({
                    otp: newOTP,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    role: constants_1.ROLES.BARBER,
                    userId: barber._id,
                });
            }
            else {
                otpCreated = await this._otpRepo.update(alreadyExistingOtp._id.toString(), { otp: newOTP, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
            }
            if (!otpCreated) {
                throw new Error("otp generation failed");
            }
            return {
                response: {
                    message: constants_1.MESSAGES.SUCCESS.OTP_RESENT,
                    user: {
                        name: barber.name,
                        email: barber.email,
                    },
                },
            };
        };
        this.login = async (email, password) => {
            if (!(0, validators_1.isValidEmail)(email)) {
                throw new Error("Invalid email Format");
            }
            if (!password) {
                throw new Error("password is required");
            }
            const barber = await this._barberRepo.findByEmail(email);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (!barber.isVerified) {
                throw new Error(constants_1.MESSAGES.ERROR.OTP_INVALID);
            }
            if (barber.status === "blocked") {
                throw new Error(constants_1.MESSAGES.ERROR.BLOCKED);
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, barber.password);
            if (!isPasswordValid) {
                throw new Error(constants_1.MESSAGES.ERROR.INVALID_CREDENTIALS);
            }
            const token = (0, jwt_generator_1.generateAccessToken)({ userId: barber._id, type: "barber" });
            const response = barber_mapper_1.BarberMapper.toLoginResponse(barber, constants_1.MESSAGES.SUCCESS.LOGIN, token);
            return {
                response,
            };
        };
        this.forgotPassword = async (email) => {
            if (!(0, validators_1.isValidEmail)(email)) {
                throw new Error("invalid email format");
            }
            const barber = await this._barberRepo.findByEmail(email);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const otp = OTPService_1.default.generateOTP();
            const alreadyExistingOtp = await this._otpRepo.findOne({
                userId: barber._id,
            });
            let otpCreated;
            if (!alreadyExistingOtp) {
                otpCreated = await this._otpRepo.create({
                    otp,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    role: constants_1.ROLES.BARBER,
                    userId: barber._id,
                });
            }
            else {
                otpCreated = await this._otpRepo.update(alreadyExistingOtp._id.toString(), { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
            }
            if (!otpCreated) {
                throw new Error("otp generation failed");
            }
            await OTPService_1.default.sendOTP(email, otp);
            console.log(otp);
            return {
                response: { message: constants_1.MESSAGES.SUCCESS.OTP_SENT },
            };
        };
        this.resetPassword = async (email, password, confirmPassword) => {
            if (!(0, validators_1.isValidEmail)(email)) {
                throw new Error(constants_1.MESSAGES.ERROR.INVALID_EMAIL);
            }
            if (!(0, validators_1.isValidPassword)(password)) {
                throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
            }
            if (password !== confirmPassword) {
                throw new Error(constants_1.MESSAGES.ERROR.PASSWORD_MISMATCH);
            }
            const barber = await this._barberRepo.findByEmail(email);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            barber.password = hashedPassword;
            await this._barberRepo.update(barber._id.toString(), barber);
            return {
                response: { message: constants_1.MESSAGES.SUCCESS.PASSWORD_RESET },
            };
        };
        this.getBarberProfileById = async (barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const response = barber_mapper_1.BarberMapper.toBarberProfileDto(barber);
            return {
                response,
            };
        };
        this.updateBarberProfile = async (barberId, data) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            if (!(0, validators_1.isValidEmail)(data.email)) {
                throw new Error("inavalid email format");
            }
            if (!(0, validators_1.isValidName)(data.name)) {
                throw new Error("inavalid name format");
            }
            if (!(0, validators_1.isValidPhone)(data.phone)) {
                throw new Error("inavalid phone format");
            }
            const existingUser = await this._barberRepo.findOne({
                email: data.email,
                _id: { $ne: barberId },
            });
            if (existingUser) {
                throw new Error("email exists, try with another email");
            }
            const updated = await this._barberRepo.update(barberId, {
                name: data.name,
                email: data.email,
                phone: data.phone,
            });
            if (!updated) {
                throw new Error("user profile updation failed");
            }
            return {
                response: barber_mapper_1.BarberMapper.toMessageResponse("Updated Barber Profile Successfully"),
            };
        };
        this.updateBarberAddress = async (barberId, data) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            if (!data.city || !data.district || !data.pincode || !data.street) {
                throw new Error("Required Fields: District, City, Street and Pincode");
            }
            const updated = await this._barberRepo.update(barberId, {
                district: data.district,
                address: {
                    city: data.city,
                    street: data.street,
                    pincode: data.pincode,
                },
            });
            if (!updated) {
                throw new Error("Address Updation Failed");
            }
            return {
                response: { message: "Barber Address Updated Successfully" },
            };
        };
        this.fetchUsers = async (search, page, limit) => {
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
        this.getDashboardStats = async (barberId, filter) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const dashboardStats = await this._bookingRepo.getDashboardStats(filter, barberId);
            return { dashboardStats };
        };
        this.updateBarberProfilePicture = async (barberId, profilePicUrl, profilePicKey) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error("uesr not found");
            }
            const updated = await this._barberRepo.update(barberId, {
                profilePicUrl,
                profilePicKey,
            });
            if (!updated) {
                throw new Error("profile picture updation failed");
            }
            const profilePictureUpdation = barber_mapper_1.BarberMapper.toMessageResponse("Profile Picture Updated successfully");
            return {
                profilePictureUpdation,
            };
        };
        this.deleteBarberProfilePicture = async (barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            if (!barber.profilePicKey) {
                throw new Error("profile picture doesn't exists");
            }
            const result = await (0, s3_operataions_1.deleteObject)(barber.profilePicKey);
            if (result !== "success") {
                throw new Error("profile picture deletion failed");
            }
            const updated = await this._barberRepo.update(barberId, {
                profilePicUrl: null,
                profilePicKey: null,
            });
            if (!updated) {
                throw new Error("profile picture deletion failed");
            }
            const profilePictureDeletion = barber_mapper_1.BarberMapper.toMessageResponse("Profile Picture Deleted successfully");
            return {
                profilePictureDeletion,
            };
        };
    }
};
exports.BarberService = BarberService;
exports.BarberService = BarberService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBarberRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IBarberUnavailabilityRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IOtpRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], BarberService);
