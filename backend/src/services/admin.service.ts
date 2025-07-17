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
        private _adminRepo:IAdminRepository,
        private _userRepo:IUserRepository,
        private _barberRepo:IBarberRepository
    ){}


    loginAdmin = async (email: string, password: string): Promise<{ admin: IAdmin; token: string; message: string; status: number; }> => {
        if (!isValidEmail(email)) {
            throw new Error("invalid email format");
        }
        
        if (!password) {
            throw new Error("password is required");
        }
        

        const admin = await this._adminRepo.findByEmail(email)
        
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
        const users = await this._userRepo.findBySearchTerm(search)

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
        const barbers = await this._barberRepo.find({})

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
        const user = await this._userRepo.findById(userId)
        if (!user) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
        }
        if (user.status === "blocked") throw new Error("User already blocked");

        const updatedUser = await this._userRepo.update(userId,{
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
        const user = await this._userRepo.findById(userId)
        if (!user) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
        }
        if (user.status === "active") throw new Error("User already active");

        const updatedUser = await this._userRepo.update(userId,{
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

    blockBarber = async (barberId: string): Promise<{ response: BarberDto; message: string; status: number; }> =>{
        const barber = await this._barberRepo.findById(barberId)
        if (!barber) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
        }
        if (barber.status === "blocked") throw new Error("barber already blocked");

        const updatedBarber = await this._barberRepo.update(barberId,{
            status: "blocked"
        })
        if (!updatedBarber) throw new Error("Could not block barber");

        const response: BarberDto = {
            id: updatedBarber._id.toString(),
            name: updatedBarber.name,
            email: updatedBarber.email,
            district: updatedBarber.district,
            status: updatedBarber.status,
            createdAt: updatedBarber.createdAt
        }

        return{
            message: MESSAGES.SUCCESS.USER_BLOCKED,
            status: STATUS_CODES.OK,
            response
        }
    }

    unBlockBarber = async (barberId: string): Promise<{ response: BarberDto; message: string; status: number; }> =>{
        const barber = await this._barberRepo.findById(barberId)
        if (!barber) {
            throw new Error(MESSAGES.ERROR.USER_NOT_FOUND)
        }
        if (barber.status === "active") throw new Error("barber already active");

        const updatedBarber = await this._barberRepo.update(barberId,{
            status: "active"
        })
        if (!updatedBarber) throw new Error("Could not unblock barber");

        const response: BarberDto = {
            id: updatedBarber._id.toString(),
            name: updatedBarber.name,
            email: updatedBarber.email,
            district: updatedBarber.district,
            status: updatedBarber.status,
            createdAt: updatedBarber.createdAt
        }

        return{
            message: MESSAGES.SUCCESS.USER_UNBLOCKED,
            status: STATUS_CODES.OK,
            response
        }
    }
}