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
  ): Promise<{ response: AdminLoginResponseDto;}>;
  listUsers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ response: ListResponseDto<UserDto>;}>;
  listBarbers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ response: ListResponseDto<BarberDto>;}>;
  blockUser(
    userId: string
  ): Promise<{ response: UserDto; message: string;}>;
  unBlockUser(
    userId: string
  ): Promise<{ response: UserDto; message: string;}>;
  blockBarber(
    barberId: string
  ): Promise<{ response: BarberDto; message: string;}>;
  unBlockBarber(
    barberId: string
  ): Promise<{ response: BarberDto; message: string;}>;
}
