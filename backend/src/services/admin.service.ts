import bcrypt from 'bcrypt'
import { IAdmin } from "../models/admin.model";
import { IAdminService } from "./interfaces/IAdminService";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { MESSAGES,STATUS_CODES } from "../utils/constants";
import { isValidEmail } from "../utils/validators";
import { AdminLoginResponseDto, BarberDto, ListResponseDto, UserDto } from "../dto/admin.dto";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { AdminMapper } from '../mappers/admin.mapper';

export class AdminService implements IAdminService{

    constructor(
        private _adminRepo:IAdminRepository,
        private _userRepo:IUserRepository,
        private _barberRepo:IBarberRepository
    ){}


    loginAdmin = async (email: string, password: string): Promise<{ response: AdminLoginResponseDto; status: number; }> => {
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

        return {
            response: AdminMapper.toLoginResponse(
                admin,
                MESSAGES.SUCCESS.LOGIN,
            ),
            status: STATUS_CODES.OK,
        };
    }

listUsers = async (
    search : string,
    page : number,
    limit : number
): Promise<{ response: ListResponseDto<UserDto>; status: number }> => {

  const { users, totalCount } = await this._userRepo.findBySearchTerm(search, page, limit);

  const response: ListResponseDto<UserDto> = {
    data: AdminMapper.toUserDtoArray(users),
    message: "Users fetched successfully",
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      itemsPerPage: limit
    }
  };

  return {
    response,
    status: STATUS_CODES.OK
  };
}


    listBarbers = async (
        search : string,
        page : number,
        limit : number
    ): Promise<{ response: ListResponseDto<BarberDto>; status: number; }> =>{
        const {barbers,totalCount} = await this._barberRepo.findBySearchTerm( search, page, limit, '')

        const response:ListResponseDto<BarberDto> = {
            data: AdminMapper.toBarberDtoArray(
                barbers
            ),
            message: "Barbers fetched successfully",
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit
            }
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

        const response: UserDto = AdminMapper.toUserDto(updatedUser)

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

        const response: UserDto = AdminMapper.toUserDto(updatedUser)

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

        const response: BarberDto = AdminMapper.toBarberDto(updatedBarber)

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

        const response: BarberDto = AdminMapper.toBarberDto(updatedBarber)

        return{
            message: MESSAGES.SUCCESS.USER_UNBLOCKED,
            status: STATUS_CODES.OK,
            response
        }
    }
}