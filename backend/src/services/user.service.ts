import bcrypt from "bcrypt";
import { IUserService } from "./interfaces/IUserService";
import {
  UserRegisterRequestDto,
  UserLoginResponseDto,
  UserProfileDto,
  UserEditProfileDto,
} from "../dto/user.dto";
import { MESSAGES, ROLES } from "../utils/constants";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidOTP,
  isValidName,
} from "../utils/validators";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import OTPService from "../utils/OTPService";
import { UserMapper } from "../mappers/user.mapper";
import { BarberDto, BarberProfileDto } from "../dto/barber.dto";

import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { ListResponseDto } from "../dto/admin.dto";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository";
import { SlotRuleListResponseDto } from "../dto/slot.dto";
import { SlotMapper } from "../mappers/slot.mapper";
import { MessageResponseDto } from "../dto/base.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import { deleteObject } from "../utils/s3.operataions";
import { v4 } from "uuid";
import { BarberMapper } from "../mappers/barber.mapper";
import { IOtpRepository } from "../repositories/interfaces/IOtpRepository";
import { IOtp } from "../models/otp.model";
import mongoose, { mongo } from "mongoose";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.IBarberRepository) private _barberRepo: IBarberRepository,
    @inject(TYPES.ISlotRepository) private _slotRepo: ISlotRepository,
    @inject(TYPES.IOtpRepository) private _otpRepo: IOtpRepository
  ) {}

  registerUser = async (
    userData: UserRegisterRequestDto
  ): Promise<{ response: MessageResponseDto }> => {
    const { name, email, password, confirmPassword, phone } = userData;

    if (!name || !email || !password || !confirmPassword) {
      throw new Error(MESSAGES.ERROR.INVALID_INPUT);
    }

    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    }

    if (phone && !isValidPhone(phone)) {
      throw new Error("Invalid phone number format");
    }

    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }

    const existingUser = await this._userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP();

    await OTPService.sendOTP(email, otp);
    console.log(otp);

    const user = await this._userRepo.create({
      ...userData,
      password: hashedPassword,
    });

    const otpCreated = await this._otpRepo.create({
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      role: ROLES.USER,
      userId: user._id,
    });

    if (!otpCreated) {
      throw new Error("otp generation failed");
    }

    return {
      response: { message: MESSAGES.SUCCESS.SIGNUP },
    };
  };

  verifyOTP = async (
    email: string,
    otp: string,
    purpose: "signup" | "forgot"
  ): Promise<{
    response: MessageResponseDto & { user: { name: string; id: string } };
  }> => {
    if (!isValidOTP(otp)) {
      throw new Error("OTP must be a 6-digit number");
    }

    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const otpGenerated = await this._otpRepo.findOne({ userId: user._id });
    if (!otpGenerated) {
      throw new Error("otp expired");
    }

    if (otpGenerated.otp !== otp) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    if (purpose === "signup") {
      user.isVerified = true;
    }

    await this._userRepo.update(user._id.toString(), user);

    return {
      response: {
        message: MESSAGES.SUCCESS.OTP_VERIFIED,
        user: {
          name: user.name,
          id: user.id,
        },
      },
    };
  };

  resendOTP = async (
    email: string,
    purpose: "signup" | "forgot"
  ): Promise<{
    response: MessageResponseDto & { user: { name: string; email: string } };
  }> => {
    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (purpose === "signup" && user.isVerified) {
      throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    }

    const newOTP = OTPService.generateOTP();
    await OTPService.sendOTP(email, newOTP);
    console.log("Generated OTP:", newOTP);

    const alreadyExistingOtp = await this._otpRepo.findOne({
      userId: user._id,
    });
    let otpCreated;
    if (!alreadyExistingOtp) {
      otpCreated = await this._otpRepo.create({
        otp: newOTP,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        role: ROLES.USER,
        userId: user._id,
      });
    } else {
      otpCreated = await this._otpRepo.update(
        (alreadyExistingOtp._id as mongoose.Types.ObjectId).toString(),
        { otp: newOTP, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
      );
    }

    if (!otpCreated) {
      throw new Error("otp generation failed");
    }

    return {
      response: {
        message: MESSAGES.SUCCESS.OTP_RESENT,
        user: {
          name: user.name,
          email: user.email,
        },
      },
    };
  };

  async processGoogleAuth(
    profile: any
  ): Promise<{ response: UserLoginResponseDto }> {
    const email = profile.email;
    let user = await this._userRepo.findByEmail(email);

    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await this._userRepo.update(user._id.toString(), user);
      }
    } else {
      user = await this._userRepo.create({
        googleId: profile.id,
        email,
        name: profile.displayName,
        password: "",
        isVerified: true,
      });
    }

    const response: UserLoginResponseDto = UserMapper.toLoginResponse(
      user,
      MESSAGES.SUCCESS.LOGIN
    );

    return {
      response,
    };
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ response: UserLoginResponseDto }> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!password) {
      throw new Error("password is required");
    }

    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (!user.isVerified) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    if (user.status === "blocked") {
      throw new Error(MESSAGES.ERROR.BLOCKED);
    }

    if (!user.password) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const response: UserLoginResponseDto = UserMapper.toLoginResponse(
      user,
      MESSAGES.SUCCESS.LOGIN
    );

    return {
      response,
    };
  }

  async forgotPassword(
    email: string
  ): Promise<{ response: MessageResponseDto }> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const otp = OTPService.generateOTP();
    const alreadyExistingOtp = await this._otpRepo.findOne({
      userId: user._id,
    });
    let otpCreated;
    if (!alreadyExistingOtp) {
      otpCreated = await this._otpRepo.create({
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        role: ROLES.USER,
        userId: user._id,
      });
    } else {
      otpCreated = await this._otpRepo.update(
        (alreadyExistingOtp._id as mongoose.Types.ObjectId).toString(),
        { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
      );
    }

    if (!otpCreated) {
      throw new Error("otp generation failed");
    }
    await OTPService.sendOTP(email, otp);
    console.log(otp);

    return {
      response: { message: MESSAGES.SUCCESS.OTP_SENT },
    };
  }

  async resetPassword(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ response: MessageResponseDto }> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email Format");
    }

    if (!isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    }

    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }

    const user = await this._userRepo.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await this._userRepo.update(user._id.toString(), user);

    return {
      response: { message: MESSAGES.SUCCESS.PASSWORD_RESET },
    };
  }

  fetchAllBarbers = async (
    search: string,
    page: number,
    limit: number,
    district: string
  ): Promise<{ response: ListResponseDto<BarberDto> }> => {
    const { totalCount, barbers } = await this._barberRepo.findBySearchTerm(
      search,
      page,
      limit,
      district
    );
    if (!barbers) {
      throw new Error("barbers not found");
    }
    const response: ListResponseDto<BarberDto> = {
      data: BarberMapper.toBarberDtoArray(barbers),
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

  fetchBarbersAndSlotRules = async (
    page: number,
    limit: number,
    barberId: string
  ): Promise<{ response: SlotRuleListResponseDto }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const { totalCount, slotRules } = await this._slotRepo.findByBarber(
      barberId,
      page,
      limit
    );

    const response: SlotRuleListResponseDto = {
      data: SlotMapper.toSlotDtoArray(slotRules),
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

  fetchBarberDetailsById = async (
    barberId: string
  ): Promise<{ barberDetailsData: BarberProfileDto }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.BARBER_NOT_FOUND);
    }

    const barberDetailsData = BarberMapper.toBarberProfileDto(barber);

    return {
      barberDetailsData,
    };
  };

  getUserProfileById = async (
    userId: string
  ): Promise<{ response: UserProfileDto }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const response = UserMapper.toProfileResponse(user);

    return {
      response,
    };
  };

  updateUserProfile = async (
    userId: string,
    data: UserEditProfileDto
  ): Promise<{ response: MessageResponseDto }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (!isValidEmail(data.email)) {
      throw new Error("inavalid email format");
    }

    if (!isValidName(data.name)) {
      throw new Error("inavalid name format");
    }

    if (!isValidPhone(data.phone)) {
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
      response: UserMapper.toMessageResponse(
        "Updated User Profile Successfully"
      ),
    };
  };

  updateUserProfilePicture = async (
    userId: string,
    profilePicUrl: string,
    profilePicKey: string
  ): Promise<{ profilePictureUpdation: MessageResponseDto }> => {
    const fileName = "images/" + v4();
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

    const profilePictureUpdation = UserMapper.toMessageResponse(
      "Profile Picture Updated successfully"
    );

    return {
      profilePictureUpdation,
    };
  };

  deleteUserProfilePicture = async (
    userId: string
  ): Promise<{ profilePictureDeletion: MessageResponseDto }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (!user.profilePicKey) {
      throw new Error("profile picture doesn't exists");
    }

    const result = await deleteObject(user.profilePicKey);
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

    const profilePictureDeletion = UserMapper.toMessageResponse(
      "Profile Picture Deleted successfully"
    );

    return {
      profilePictureDeletion,
    };
  };
}
