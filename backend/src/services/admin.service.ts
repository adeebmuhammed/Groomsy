import bcrypt from "bcrypt";
import { IAdminService } from "./interfaces/IAdminService";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { DASHBOARDFILTERS, MESSAGES } from "../utils/constants";
import { isValidEmail } from "../utils/validators";
import {
  AdminDashboardStatsDto,
  AdminLoginResponseDto,
  BarberDto,
  ListResponseDto,
  UserDto,
} from "../dto/admin.dto";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { AdminMapper } from "../mappers/admin.mapper";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { UserMapper } from "../mappers/user.mapper";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.IAdminRepository) private _adminRepo: IAdminRepository,
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.IBarberRepository) private _barberRepo: IBarberRepository,
    @inject(TYPES.IBookingRepository) private _bookingRepo: IBookingRepository
  ) {}

  loginAdmin = async (
    email: string,
    password: string
  ): Promise<{ response: AdminLoginResponseDto }> => {
    if (!isValidEmail(email)) {
      throw new Error("invalid email format");
    }

    if (!password) {
      throw new Error("password is required");
    }

    const admin = await this._adminRepo.findByEmail(email);

    if (!admin) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    return {
      response: AdminMapper.toLoginResponse(admin, MESSAGES.SUCCESS.LOGIN),
    };
  };

  listUsers = async (
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

  listBarbers = async (
    search: string,
    page: number,
    limit: number
  ): Promise<{ response: ListResponseDto<BarberDto> }> => {
    const { barbers, totalCount } = await this._barberRepo.findBySearchTerm(
      search,
      page,
      limit,
      ""
    );

    const response: ListResponseDto<BarberDto> = {
      data: AdminMapper.toBarberDtoArray(barbers),
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

  blockUser = async (
    userId: string
  ): Promise<{ response: UserDto; message: string }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    if (user.status === "blocked") throw new Error("User already blocked");

    const updatedUser = await this._userRepo.update(userId, {
      status: "blocked",
    });
    if (!updatedUser) throw new Error("Could not block user");

    const response: UserDto = UserMapper.toUserDto(updatedUser);

    return {
      message: MESSAGES.SUCCESS.USER_BLOCKED,
      response,
    };
  };

  unBlockUser = async (
    userId: string
  ): Promise<{ response: UserDto; message: string }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    if (user.status === "active") throw new Error("User already active");

    const updatedUser = await this._userRepo.update(userId, {
      status: "active",
    });
    if (!updatedUser) throw new Error("Could not unblock user");

    const response: UserDto = UserMapper.toUserDto(updatedUser);

    return {
      message: MESSAGES.SUCCESS.USER_UNBLOCKED,
      response,
    };
  };

  blockBarber = async (
    barberId: string
  ): Promise<{ response: BarberDto; message: string }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.BARBER_NOT_FOUND);
    }
    if (barber.status === "blocked") throw new Error("barber already blocked");

    const updatedBarber = await this._barberRepo.update(barberId, {
      status: "blocked",
    });
    if (!updatedBarber) throw new Error("Could not block barber");

    const response: BarberDto = AdminMapper.toBarberDto(updatedBarber);

    return {
      message: MESSAGES.SUCCESS.USER_BLOCKED,
      response,
    };
  };

  unBlockBarber = async (
    barberId: string
  ): Promise<{ response: BarberDto; message: string }> => {
    const barber = await this._barberRepo.findById(barberId);
    if (!barber) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    if (barber.status === "active") throw new Error("barber already active");

    const updatedBarber = await this._barberRepo.update(barberId, {
      status: "active",
    });
    if (!updatedBarber) throw new Error("Could not unblock barber");

    const response: BarberDto = AdminMapper.toBarberDto(updatedBarber);

    return {
      message: MESSAGES.SUCCESS.USER_UNBLOCKED,
      response,
    };
  };

  getAdminDashboardStats = async (
    filter: DASHBOARDFILTERS
  ): Promise<{ dashboardStats: AdminDashboardStatsDto }> => {
    const dashboardStats = await this._bookingRepo.getDashboardStats(
      filter
    );
    
    return { dashboardStats };
  };
}
