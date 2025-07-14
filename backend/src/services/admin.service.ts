import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { IAdmin } from "../models/admin.model";
import { IAdminService } from "./interfaces/IAdminService";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { MESSAGES,STATUS_CODES } from "../utils/constants";
import { isValidEmail } from "../utils/validators";
import { BarberDto, ListResponseDto, UserDto } from "../dto/admin.dto";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";

export class AdminService implements IAdminService{

    constructor(
        private adminRepo:IAdminRepository,
        private userRepo:IUserRepository,
        private barberRepo:IBarberRepository
    ){}


    loginAdmin = async (email: string, password: string): Promise<{ admin: IAdmin; token: string; message: string; status: number; }> => {
        if (!isValidEmail(email)) {
            throw new Error("invalid email format");
        }
        
        if (!password) {
            throw new Error("password is required");
        }
        

        const admin = await this.adminRepo.findByEmail(email)
        
        if (!admin) {
            throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
        }

        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
        }

        const token = jwt.sign({ userId: admin._id, type: "admin" }, jwtSecret, {
            expiresIn: "1h",
        });

        return {
            admin,
            token,
            message: MESSAGES.SUCCESS.LOGIN,
            status: STATUS_CODES.OK,
        };
    }

    listUsers = async (search = ""): Promise<{ response: ListResponseDto<UserDto>; status: number; }> => {
        const users = await this.userRepo.findBySearchTerm(search)

        const userDtos: UserDto[] = users.map((user: any) => ({
            id: user._id?.toString(),
            name: user.name,
            email: user.email,
            status: user.status,
            createdAt: user.createdAt,
        }));
        
        const response: ListResponseDto<UserDto> = {
            data: userDtos,
            message: "Users fetched successfully"
        };

        return {
            response,
            status: STATUS_CODES.OK
        }
    }

    listBarbers = async (search = ""): Promise<{ response: ListResponseDto<BarberDto>; status: number; }> =>{
        const barbers = await this.barberRepo.find({})

        const barberDtos: BarberDto[] = barbers.map((barber: any) => ({
            id: barber._id?.toString(),
            name: barber.name,
            email: barber.email,
            phone: barber.phone,
            district: barber.district,
            status: barber.status,
            createdAt: barber.createdAt,
        }));

        const response:ListResponseDto<BarberDto> = {
            data: barberDtos,
            message: "Barbers fetched successfully"
        }

        return {
            response,
            status: STATUS_CODES.OK
        }
    }

    blockUser = async (userId: string): Promise<{ response: UserDto; message: string; status: number; }> =>{
        const user = await this.userRepo.findById(userId)
        if (!user) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
        }
        if (user.status === "blocked") throw new Error("User already blocked");

        const updatedUser = await this.userRepo.update(userId,{
            status: "blocked"
        })
        if (!updatedUser) throw new Error("Could not block user");

        const response: UserDto = {
            id: updatedUser._id.toString(),
            name: updatedUser.name,
            email: updatedUser.email,
            status: updatedUser.status,
            createdAt: updatedUser.createdAt
        }

        return{
            message: MESSAGES.SUCCESS.USER_BLOCKED,
            status: STATUS_CODES.OK,
            response
        }
    }

    unBlockUser = async (userId: string): Promise<{ response: UserDto; message: string; status: number; }> =>{
        const user = await this.userRepo.findById(userId)
        if (!user) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
        }
        if (user.status === "active") throw new Error("User already active");

        const updatedUser = await this.userRepo.update(userId,{
            status: "active"
        })
        if (!updatedUser) throw new Error("Could not unblock user");

        const response: UserDto = {
            id: updatedUser._id.toString(),
            name: updatedUser.name,
            email: updatedUser.email,
            status: updatedUser.status,
            createdAt: updatedUser.createdAt
        }

        return{
            message: MESSAGES.SUCCESS.USER_UNBLOCKED,
            status: STATUS_CODES.OK,
            response
        }
    }
}