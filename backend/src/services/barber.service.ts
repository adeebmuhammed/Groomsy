import {
  BarberLoginResponseDto,
  BarberRegisterRequestDto,
} from "../dto/barber.dto";
import { IBarberService } from "./interfaces/IBarberService";
import bcrypt from "bcrypt";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidOTP,
} from "../utils/validators";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import OTPService from "../utils/OTPService";
import { BarberMapper } from "../mappers/barber.mapper";
import { AdminMapper } from "../mappers/admin.mapper";
import { generateAccessToken } from "../utils/jwt.generator";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { IBarberUnavailabilityRepository } from "../repositories/interfaces/IBarberUnavailabilityRepository";
import { BarberUnavailabilityRepository } from "../repositories/barber.unavailability.repository";
import mongoose, { ObjectId } from "mongoose";
import { MessageResponseDto } from "../dto/base.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class BarberService implements IBarberService {
  constructor(
    @inject(TYPES.IBarberRepository) private _barberRepo: IBarberRepository,
    @inject(TYPES.IBarberUnavailabilityRepository)
    private _barberUnavailabilityRepo: IBarberUnavailabilityRepository
  ) {}

  registerBarber = async (
    barberData: BarberRegisterRequestDto
  ): Promise<{ response: MessageResponseDto; status: number }> => {
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
      status: STATUS_CODES.CREATED,
    };
  };

  verifyOTP = async (
    email: string,
    otp: string,
    purpose: "signup" | "forgot"
  ): Promise<{
    response: MessageResponseDto & { barber: { name: string; email: string } };
    status: number;
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
      status: STATUS_CODES.OK,
    };
  };

  resendOTP = async (
    email: string,
    purpose: "signup" | "forgot"
  ): Promise<{
    response: MessageResponseDto & { user: { name: string; email: string } };
    status: number;
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
      status: STATUS_CODES.OK,
    };
  };

  login = async (
    email: string,
    password: string
  ): Promise<{ response: BarberLoginResponseDto; status: number }> => {
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
      status: STATUS_CODES.OK,
    };
  };

  forgotPassword = async (
    email: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
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
      status: STATUS_CODES.OK,
    };
  };

  resetPassword = async (
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
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
      status: STATUS_CODES.OK,
    };
  };
}
