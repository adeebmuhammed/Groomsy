import {
  BarberLoginResponseDto,
  BarberProfileDto,
  BarberRegisterRequestDto,
  BookingStatsResponseDto,
  updateAddressDto,
  UpdateBarberProfileDto,
} from "../dto/barber.dto";
import { IBarberService } from "./interfaces/IBarberService";
import bcrypt from "bcrypt";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidOTP,
} from "../utils/validators";
import { DASHBOARDFILTERS, MESSAGES, STATUS_CODES } from "../utils/constants";
import OTPService from "../utils/OTPService";
import { BarberMapper } from "../mappers/barber.mapper";
import { generateAccessToken } from "../utils/jwt.generator";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { IBarberUnavailabilityRepository } from "../repositories/interfaces/IBarberUnavailabilityRepository";
import mongoose from "mongoose";
import { MessageResponseDto } from "../dto/base.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { BookingMapper } from "../mappers/booking.mapper";
import { ListResponseDto, UserDto } from "../dto/admin.dto";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserMapper } from "../mappers/user.mapper";

@injectable()
export class BarberService implements IBarberService {
  constructor(
    @inject(TYPES.IBarberRepository) private _barberRepo: IBarberRepository,
    @inject(TYPES.IBarberUnavailabilityRepository)
    private _barberUnavailabilityRepo: IBarberUnavailabilityRepository,
    @inject(TYPES.IBookingRepository) private _bookingRepo: IBookingRepository,
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository
  ) {}

  registerBarber = async (
    barberData: BarberRegisterRequestDto
  ): Promise<{ response: MessageResponseDto }> => {
    const { name, email, phone, district, password } = barberData;
    if (!email || !email || !phone || !district || !password) {
      throw new Error(MESSAGES.ERROR.INVALID_INPUT);
    }

    if (!isValidEmail(email)) {
      throw new Error("Invalid Email Format");
    }

    if (!isValidPhone(phone)) {
      throw new Error("Invalid Phone Number Format");
    }

    if (!isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    }

    const existingBarber = await this._barberRepo.findByEmail(email);
    if (existingBarber) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = OTPService.generateOTP();
    await OTPService.sendOTP(email, otp);
    console.log(otp);

    const newBarber = await this._barberRepo.create({
      ...barberData,
      otp,
      password: hashedPassword,
      isVerified: false,
    });

    await this._barberUnavailabilityRepo.create({
      barber: new mongoose.Types.ObjectId(newBarber._id.toString()),
      weeklyOff: "Sunday",
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
    response: MessageResponseDto & { barber: { name: string; email: string } };
  }> => {
    if (!isValidOTP(otp)) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    const barber = await this._barberRepo.findByEmail(email);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (barber.otp !== otp) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (purpose === "signup") {
      barber.isVerified = true;
    }

    barber.otp = null;

    await this._barberRepo.update(barber._id.toString(), barber);

    return {
      response: {
        message: MESSAGES.SUCCESS.OTP_VERIFIED,
        barber: {
          name: barber.name,
          email: barber.email,
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
    const barber = await this._barberRepo.findByEmail(email);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (purpose === "signup" && barber.isVerified) {
      throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    }

    const newOTP = OTPService.generateOTP();
    await OTPService.sendOTP(email, newOTP);
    console.log(newOTP);

    barber.otp = newOTP;
    await this._barberRepo.update(barber._id.toString(), barber);

    return {
      response: {
        message: MESSAGES.SUCCESS.OTP_RESENT,
        user: {
          name: barber.name,
          email: barber.email,
        },
      },
    };
  };

  login = async (
    email: string,
    password: string
  ): Promise<{ response: BarberLoginResponseDto }> => {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email Format");
    }

    if (!password) {
      throw new Error("password is required");
    }

    const barber = await this._barberRepo.findByEmail(email);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    if (!barber.isVerified) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }

    if (barber.status === "blocked") {
      throw new Error(MESSAGES.ERROR.BLOCKED);
    }

    const isPasswordValid = await bcrypt.compare(password, barber.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const token = generateAccessToken({ userId: barber._id, type: "barber" });

    const response: BarberLoginResponseDto = BarberMapper.toLoginResponse(
      barber,
      MESSAGES.SUCCESS.LOGIN,
      token
    );

    return {
      response,
    };
  };

  forgotPassword = async (
    email: string
  ): Promise<{ response: MessageResponseDto }> => {
    if (!isValidEmail(email)) {
      throw new Error("invalid email format");
    }

    const barber = await this._barberRepo.findByEmail(email);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const otp = OTPService.generateOTP();
    barber.otp = otp;
    await this._barberRepo.update(barber._id.toString(), barber);
    await OTPService.sendOTP(email, otp);
    console.log(otp);

    return {
      response: { message: MESSAGES.SUCCESS.OTP_SENT },
    };
  };

  resetPassword = async (
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ response: MessageResponseDto }> => {
    if (!isValidEmail(email)) {
      throw new Error(MESSAGES.ERROR.INVALID_EMAIL);
    }

    if (!isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    }

    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }

    const barber = await this._barberRepo.findByEmail(email);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    barber.password = hashedPassword;
    await this._barberRepo.update(barber._id.toString(), barber);

    return {
      response: { message: MESSAGES.SUCCESS.PASSWORD_RESET },
    };
  };

  getBarberProfileById = async (
    barberId: string
  ): Promise<{ response: BarberProfileDto }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("Barber Not Found");
    }

    const response = BarberMapper.toBarberProfileDto(barber);

    return {
      response,
    };
  };

  updateBarberProfile = async (
    barberId: string,
    data: UpdateBarberProfileDto
  ): Promise<{ response: MessageResponseDto }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("Barber Not Found");
    }

    if (!isValidEmail(data.email)) {
      throw new Error("inavalid email format");
    }

    if (!isValidPhone(data.phone)) {
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
      response: BarberMapper.toMessageResponse(
        "Updated Barber Profile Successfully"
      ),
    };
  };

  updateBarberAddress = async (
    barberId: string,
    data: updateAddressDto
  ): Promise<{ response: MessageResponseDto }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error("Barber Not Found");
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

  fetchUsers = async (
      search: string,
      page: number,
      limit: number
    ): Promise<{ response: ListResponseDto<UserDto> }> => {
      const { users, totalCount } = await this._userRepo.findBySearchTerm(
        search,
        page,
        limit
      );
  
      const response: ListResponseDto<UserDto> = {
        data: UserMapper.toUserDtoArray(users),
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

  // getBookingStats = async (
  //   barberId: string,
  //   filter: DASHBOARDFILTERS
  // ): Promise<BookingStatsResponseDto[]> => {
  //   const barber = await this._barberRepo.findById(barberId);
  //   if (!barber) {
  //     throw new Error("Barber Not Found");
  //   }

  //   // const { labels, counts } = await this._bookingRepo.getDashboardStats(
  //   //   barberId,
  //   //   filter
  //   // );

  //   console.log(labels,counts)

  //   const response = BookingMapper.toBookingStatsResponseDto(labels, counts);
  //   console.log(response);
    

  //   return response;
  // };
}
