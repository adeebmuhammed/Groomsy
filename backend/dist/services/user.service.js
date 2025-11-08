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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../utils/constants");
const validators_1 = require("../utils/validators");
const OTPService_1 = __importDefault(require("../utils/OTPService"));
const user_mapper_1 = require("../mappers/user.mapper");
const slot_mapper_1 = require("../mappers/slot.mapper");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const s3_operataions_1 = require("../utils/s3.operataions");
const uuid_1 = require("uuid");
const barber_mapper_1 = require("../mappers/barber.mapper");
let UserService = class UserService {
    constructor(_userRepo, _barberRepo, _slotRepo, _otpRepo) {
        this._userRepo = _userRepo;
        this._barberRepo = _barberRepo;
        this._slotRepo = _slotRepo;
        this._otpRepo = _otpRepo;
        this.registerUser = async (userData) => {
            const { name, email, password, confirmPassword, phone } = userData;
            if (!name || !email || !password || !confirmPassword) {
                throw new Error(constants_1.MESSAGES.ERROR.INVALID_INPUT);
            }
            if (!(0, validators_1.isValidEmail)(email)) {
                throw new Error("Invalid email format");
            }
            if (!(0, validators_1.isValidPassword)(password)) {
                throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
            }
            if (phone && !(0, validators_1.isValidPhone)(phone)) {
                throw new Error("Invalid phone number format");
            }
            if (password !== confirmPassword) {
                throw new Error(constants_1.MESSAGES.ERROR.PASSWORD_MISMATCH);
            }
            const existingUser = await this._userRepo.findByEmail(email);
            if (existingUser) {
                throw new Error(constants_1.MESSAGES.ERROR.EMAIL_EXISTS);
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const otp = OTPService_1.default.generateOTP();
            await OTPService_1.default.sendOTP(email, otp);
            console.log(otp);
            const user = await this._userRepo.create({
                ...userData,
                password: hashedPassword,
            });
            const otpCreated = await this._otpRepo.create({
                otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                role: constants_1.ROLES.USER,
                userId: user._id,
            });
            if (!otpCreated) {
                throw new Error("otp generation failed");
            }
            return {
                response: { message: constants_1.MESSAGES.SUCCESS.SIGNUP },
            };
        };
        this.verifyOTP = async (email, otp, purpose) => {
            if (!(0, validators_1.isValidOTP)(otp)) {
                throw new Error("OTP must be a 6-digit number");
            }
            const user = await this._userRepo.findByEmail(email);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const otpGenerated = await this._otpRepo.findOne({ userId: user._id });
            if (!otpGenerated) {
                throw new Error("otp expired");
            }
            if (otpGenerated.otp !== otp) {
                throw new Error(constants_1.MESSAGES.ERROR.OTP_INVALID);
            }
            if (purpose === "signup") {
                user.isVerified = true;
            }
            await this._userRepo.update(user._id.toString(), user);
            return {
                response: {
                    message: constants_1.MESSAGES.SUCCESS.OTP_VERIFIED,
                    user: {
                        name: user.name,
                        id: user.id,
                    },
                },
            };
        };
        this.resendOTP = async (email, purpose) => {
            const user = await this._userRepo.findByEmail(email);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (purpose === "signup" && user.isVerified) {
                throw new Error(constants_1.MESSAGES.ERROR.ALREADY_VERIFIED);
            }
            const newOTP = OTPService_1.default.generateOTP();
            await OTPService_1.default.sendOTP(email, newOTP);
            console.log("Generated OTP:", newOTP);
            const alreadyExistingOtp = await this._otpRepo.findOne({
                userId: user._id,
            });
            let otpCreated;
            if (!alreadyExistingOtp) {
                otpCreated = await this._otpRepo.create({
                    otp: newOTP,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    role: constants_1.ROLES.USER,
                    userId: user._id,
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
                        name: user.name,
                        email: user.email,
                    },
                },
            };
        };
        this.fetchAllBarbers = async (search, page, limit, district) => {
            const { totalCount, barbers } = await this._barberRepo.findBySearchTerm(search, page, limit, district);
            if (!barbers) {
                throw new Error("barbers not found");
            }
            const response = {
                data: barber_mapper_1.BarberMapper.toBarberDtoArray(barbers),
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
        this.fetchBarbersAndSlotRules = async (page, limit, barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const { totalCount, slotRules } = await this._slotRepo.findByBarber(barberId, page, limit);
            const response = {
                data: slot_mapper_1.SlotMapper.toSlotDtoArray(slotRules),
                message: "Slots fetched successfully",
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
        this.fetchBarberDetailsById = async (barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const barberDetailsData = barber_mapper_1.BarberMapper.toBarberProfileDto(barber);
            return {
                barberDetailsData,
            };
        };
        this.getUserProfileById = async (userId) => {
            const user = await this._userRepo.findById(userId);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const response = user_mapper_1.UserMapper.toProfileResponse(user);
            return {
                response,
            };
        };
        this.updateUserProfile = async (userId, data) => {
            const user = await this._userRepo.findById(userId);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
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
            const existingUser = await this._userRepo.findOne({
                email: data.email,
                _id: { $ne: userId },
            });
            if (existingUser) {
                throw new Error("email exists, try with another email");
            }
            const updated = await this._userRepo.update(userId, {
                name: data.name,
                email: data.email,
                phone: data.phone,
            });
            if (!updated) {
                throw new Error("user profile updation failed");
            }
            return {
                response: user_mapper_1.UserMapper.toMessageResponse("Updated User Profile Successfully"),
            };
        };
        this.updateUserProfilePicture = async (userId, profilePicUrl, profilePicKey) => {
            const fileName = "images/" + (0, uuid_1.v4)();
            const user = await this._userRepo.findById(userId);
            if (!user) {
                throw new Error("uesr not found");
            }
            const updated = await this._userRepo.update(userId, {
                profilePicUrl,
                profilePicKey,
            });
            if (!updated) {
                throw new Error("profile picture updation failed");
            }
            const profilePictureUpdation = user_mapper_1.UserMapper.toMessageResponse("Profile Picture Updated successfully");
            return {
                profilePictureUpdation,
            };
        };
        this.deleteUserProfilePicture = async (userId) => {
            const user = await this._userRepo.findById(userId);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            if (!user.profilePicKey) {
                throw new Error("profile picture doesn't exists");
            }
            const result = await (0, s3_operataions_1.deleteObject)(user.profilePicKey);
            if (result !== "success") {
                throw new Error("profile picture deletion failed");
            }
            const updated = await this._userRepo.update(userId, {
                profilePicUrl: null,
                profilePicKey: null,
            });
            if (!updated) {
                throw new Error("profile picture deletion failed");
            }
            const profilePictureDeletion = user_mapper_1.UserMapper.toMessageResponse("Profile Picture Deleted successfully");
            return {
                profilePictureDeletion,
            };
        };
    }
    async processGoogleAuth(profile) {
        const email = profile.email;
        let user = await this._userRepo.findByEmail(email);
        if (user) {
            if (!user.googleId) {
                user.googleId = profile.id;
                await this._userRepo.update(user._id.toString(), user);
            }
        }
        else {
            user = await this._userRepo.create({
                googleId: profile.id,
                email,
                name: profile.displayName,
                password: "",
                isVerified: true,
            });
        }
        const response = user_mapper_1.UserMapper.toLoginResponse(user, constants_1.MESSAGES.SUCCESS.LOGIN);
        return {
            response,
        };
    }
    async loginUser(email, password) {
        if (!(0, validators_1.isValidEmail)(email)) {
            throw new Error("Invalid email format");
        }
        if (!password) {
            throw new Error("password is required");
        }
        const user = await this._userRepo.findByEmail(email);
        if (!user) {
            throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
        }
        if (!user.isVerified) {
            throw new Error(constants_1.MESSAGES.ERROR.OTP_INVALID);
        }
        if (user.status === "blocked") {
            throw new Error(constants_1.MESSAGES.ERROR.BLOCKED);
        }
        if (!user.password) {
            throw new Error(constants_1.MESSAGES.ERROR.INVALID_CREDENTIALS);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error(constants_1.MESSAGES.ERROR.INVALID_CREDENTIALS);
        }
        const response = user_mapper_1.UserMapper.toLoginResponse(user, constants_1.MESSAGES.SUCCESS.LOGIN);
        return {
            response,
        };
    }
    async forgotPassword(email) {
        if (!(0, validators_1.isValidEmail)(email)) {
            throw new Error("Invalid email format");
        }
        const user = await this._userRepo.findByEmail(email);
        if (!user) {
            throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
        }
        const otp = OTPService_1.default.generateOTP();
        const alreadyExistingOtp = await this._otpRepo.findOne({
            userId: user._id,
        });
        let otpCreated;
        if (!alreadyExistingOtp) {
            otpCreated = await this._otpRepo.create({
                otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                role: constants_1.ROLES.USER,
                userId: user._id,
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
    }
    async resetPassword(email, password, confirmPassword) {
        if (!(0, validators_1.isValidEmail)(email)) {
            throw new Error("Invalid email Format");
        }
        if (!(0, validators_1.isValidPassword)(password)) {
            throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
        }
        if (password !== confirmPassword) {
            throw new Error(constants_1.MESSAGES.ERROR.PASSWORD_MISMATCH);
        }
        const user = await this._userRepo.findByEmail(email);
        if (!user) {
            throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        user.password = hashedPassword;
        await this._userRepo.update(user._id.toString(), user);
        return {
            response: { message: constants_1.MESSAGES.SUCCESS.PASSWORD_RESET },
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IBarberRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ISlotRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IOtpRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UserService);
