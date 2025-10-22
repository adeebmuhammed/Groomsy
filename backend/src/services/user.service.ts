import bcrypt from "bcrypt";
import { IUserService } from "./interfaces/IUserService";
import {
  UserRegisterRequestDto,
  UserLoginResponseDto,
  UserProfileDto,
  UserEditProfileDto,
} from "../dto/user.dto";
import { MESSAGES } from "../utils/constants";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidOTP,
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
import { UploadedFile } from "express-fileupload";
import { deleteObject, putObject } from "../utils/s3.operataions";
import { v4 } from "uuid";
import { BarberMapper } from "../mappers/barber.mapper";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.IBarberRepository) private _barberRepo: IBarberRepository,
    @inject(TYPES.ISlotRepository) private _slotRepo: ISlotRepository
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

    await this._userRepo.create({
      ...userData,
      password: hashedPassword,
      otp,
    });

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

    if (user.otp !== otp) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    if (purpose === "signup") {
      user.isVerified = true;
    }

    user.otp = null;

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

    user.otp = newOTP;
    await this._userRepo.update(user._id.toString(), user);

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
    user.otp = otp;
    await this._userRepo.update(user.id.toString(), user);
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
      throw new Error("barber not found");
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
    file: UploadedFile
  ): Promise<{ profilePictureUpdation: MessageResponseDto }> => {
    const fileName = "images/" + v4();
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error("uesr not found");
    }

    const { url, key } = await putObject(file, fileName);

    if (!url || !key) {
      throw new Error("profile picture is not uploaded");
    }

    const updated = await this._userRepo.update(userId, {
      profilePicUrl: url,
      profilePicKey: key,
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
      throw new Error("user not found");
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
