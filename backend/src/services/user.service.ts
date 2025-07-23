import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserService } from "./interfaces/IUserService";
import { UserRegisterRequestDto, MessageResponseDto, UserLoginResponseDto } from "../dto/user.dto";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { isValidEmail,isValidPassword,isValidPhone,isValidOTP } from "../utils/validators";
import { IUserRepository } from '../repositories/interfaces/IUserRepository'
import OTPService from '../utils/OTPService'
import { UserMapper } from "../mappers/user.mapper";

export class UserService implements IUserService{

    constructor(private _userRepo : IUserRepository){}


    registerUser = async (userData: UserRegisterRequestDto): Promise<{ response: MessageResponseDto, status: number }> => {
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
        )}

        if (phone && !isValidPhone(phone)) {
            throw new Error("Invalid phone number format");
        }
        
        if (password !== confirmPassword) {
            throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
        }

        const existingUser = await this._userRepo.findByEmail(email)
        if (existingUser) {
            throw new Error(MESSAGES.ERROR.EMAIL_EXISTS)
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const otp = OTPService.generateOTP()

        await OTPService.sendOTP(email, otp);
        console.log(otp);

        await this._userRepo.create({
            ...userData,
            password:hashedPassword,
            otp
        })

        return {
            response:{message:MESSAGES.SUCCESS.SIGNUP},
            status:STATUS_CODES.CREATED
        }
    }

    verifyOTP = async (
        email: string,
        otp: string,
        purpose: 'signup' | 'forgot'
    ): Promise<{ response: MessageResponseDto & { user: { name: string, email: string } }, status: number }> => {
        
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

        if (purpose === 'signup') {
            user.isVerified = true;
        }
        
        user.otp = null;
        
        await this._userRepo.update(user._id.toString(), user);
        
        return {
            response: {
                message: MESSAGES.SUCCESS.OTP_VERIFIED,
                user: {
                    name: user.name,
                    email: user.email,
                },
            },
            status: STATUS_CODES.OK,
        };
    };


    resendOTP = async (
  email: string,
  purpose: 'signup' | 'forgot'
): Promise<{
  response: MessageResponseDto & { user: { name: string; email: string } };
  status: number;
}> => {
  const user = await this._userRepo.findByEmail(email);
  if (!user) {
    throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
  }

  if (purpose === 'signup' && user.isVerified) {
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
    status: STATUS_CODES.OK,
  };
};


    async processGoogleAuth(profile: any): Promise<{ response: UserLoginResponseDto; status: number; }> {
        const email = profile.email
        let user = await this._userRepo.findByEmail(email)

        if (user) {
            if (!user.googleId) {
                user.googleId = profile.id
                await this._userRepo.update(user._id.toString(),user)
            }
        }else{
            user = await this._userRepo.create({
                googleId:profile.id,
                email,
                name:profile.displayName,
                password:"",
                isVerified:true
            })
        }

        const response : UserLoginResponseDto = UserMapper.toLoginResponse(
            user,
            MESSAGES.SUCCESS.LOGIN
        )

        return {
            response,
            status:STATUS_CODES.OK
        }
    }

    async loginUser(email: string, password: string): Promise<{ response: UserLoginResponseDto; status: number; }> {
        
        if (!isValidEmail(email)) {
            throw new Error("Invalid email format");
        }

        if (!password) {
            throw new Error("password is required")
        }

        const user = await this._userRepo.findByEmail(email)

        if (!user) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
        }

        if (!user.isVerified) {
            throw new Error(MESSAGES.ERROR.OTP_INVALID)
        }

        if (user.status === "blocked") {
            throw new Error(MESSAGES.ERROR.BLOCKED)
        }

        if (!user.password) {
            throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS)
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)
        if (!isPasswordValid) {
            throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS)
        }

        const response : UserLoginResponseDto = UserMapper.toLoginResponse(
            user,
            MESSAGES.SUCCESS.LOGIN
        )

        return {
            response,
            status : STATUS_CODES.OK
        }
    }

    async forgotPassword(email: string): Promise<{ response: MessageResponseDto; status: number; }> {
        if (!isValidEmail(email)) {
            throw new Error('Invalid email format')
        }

        const user = await this._userRepo.findByEmail(email)
        if (!user) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
        }

        const otp = OTPService.generateOTP()
        user.otp = otp
        await this._userRepo.update(user.id.toString(),user)
        await OTPService.sendOTP(email,otp)
        console.log(otp);
        
        return {
            response:{message:MESSAGES.SUCCESS.OTP_SENT},
            status:STATUS_CODES.OK
        }
    }

    async resetPassword(email: string, password: string, confirmPassword: string): Promise<{ response: MessageResponseDto; status: number; }> {
        if (!isValidEmail(email)) {
            throw new Error("Invalid email Format")
        }

        if (!isValidPassword(password)) {
            throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character")
        }

        if (password !== confirmPassword) {
            throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH)
        }

        const user = await this._userRepo.findByEmail(email)
        if (!user) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
        }

        const hashedPassword = await bcrypt.hash(password,10)
        user.password = hashedPassword
        await this._userRepo.update(user._id.toString(),user)

        return {
            response: {message: MESSAGES.SUCCESS.PASSWORD_RESET},
            status: STATUS_CODES.OK
        }
    }
}