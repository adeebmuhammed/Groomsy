import {
  BarberDto,
  ListResponseDto,
  UserDto,
  AdminLoginResponseDto,
} from "../../dto/admin.dto";
import { IAdmin } from "../../models/admin.model";

export interface IAdminService {
  loginAdmin(
    email: string,
    password: string
  ): Promise<{ response: AdminLoginResponseDto; status: number }>;
  listUsers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ response: ListResponseDto<UserDto>; status: number }>;
  listBarbers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ response: ListResponseDto<BarberDto>; status: number }>;
  blockUser(
    userId: string
  ): Promise<{ response: UserDto; message: string; status: number }>;
  unBlockUser(
    userId: string
  ): Promise<{ response: UserDto; message: string; status: number }>;
  blockBarber(
    barberId: string
  ): Promise<{ response: BarberDto; message: string; status: number }>;
  unBlockBarber(
    barberId: string
  ): Promise<{ response: BarberDto; message: string; status: number }>;
}
