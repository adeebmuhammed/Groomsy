import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserService } from "./interfaces/IUserService";
import { UserRegisterRequestDto, MessageResponseDto, UserLoginResponseDto } from "../dto/user.dto";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { isValidEmail,isValidPassword,isValidPhone,isValidOTP } from "../utils/validators";
import { IUserRepository } from '../repositories/interfaces/IUserRepository'
import OTPService from '../utils/OTPService'

export class UserService implements IUserService{

    constructor(private userRepo : IUserRepository){}


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

        const existingUser = await this.userRepo.findByEmail(email)
        if (existingUser) {
            throw new Error(MESSAGES.ERROR.EMAIL_EXISTS)
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const otp = OTPService.generateOTP()

        await OTPService.sendOTP(email, otp);
        console.log(otp);

        await this.userRepo.create({
            ...userData,
            password:hashedPassword,
            otp
        })

        return {
            response:{message:MESSAGES.SUCCESS.SIGNUP},
            status:STATUS_CODES.CREATED
        }
    }

    verifyOTP = async (email: string, otp: string): Promise<{ response: MessageResponseDto & { user: { name: string } }, status: number }> => {
        if (!isValidOTP(otp)) {
            throw new Error("OTP must be a 6-digit number")
        }

        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
        }

        if (user.otp !== otp) {
            throw new Error(MESSAGES.ERROR.OTP_INVALID);
        }

        user.isVerified = true;
        user.otp = undefined;

        await this.userRepo.update(user._id.toString(), user);

        return {
            response: {
                message: MESSAGES.SUCCESS.OTP_VERIFIED,
                user: { name: user.name }
            },
            status: STATUS_CODES.OK,
        };
    }

    resendOTP = async (email: string): Promise<{ response: MessageResponseDto & { user: { name: string; }; }; status: number; }> => {

            const user = await this.userRepo.findByEmail(email)
            if (!user) {
                throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
            }

            if (user?.isVerified) {
                throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED)
            }

            const newOTP = OTPService.generateOTP()
            await OTPService.sendOTP(email,newOTP)
            console.log(newOTP);
            
            
            user.otp = newOTP
            await this.userRepo.update(user._id.toString(),user)

            return {
            response: {
                message: MESSAGES.SUCCESS.OTP_RESENT,
                user: { name: user.name }
            },
            status: STATUS_CODES.OK,
        };
    }

    async processGoogleAuth(profile: any): Promise<{ response: UserLoginResponseDto; status: number; }> {
        const email = profile.email
        let user = await this.userRepo.findByEmail(email)

        if (user) {
            if (!user.googleId) {
                user.googleId = profile.id
                await this.userRepo.update(user._id.toString(),user)
            }
        }else{
            user = await this.userRepo.create({
                googleId:profile.id,
                email,
                name:profile.displayName,
                password:"",
                isVerified:true
            })
        }

        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING)
        }

        const token = jwt.sign({
            userId:user._id,
            type: "user",
            name: user.name,
            email: user.email,
            phone: user.phone,
        },jwtSecret, { expiresIn : '1h'})

        const response : UserLoginResponseDto = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            token: token,
            message: MESSAGES.SUCCESS.LOGIN
        }

        return {
            response,
            status:STATUS_CODES.OK
        }
    }
}