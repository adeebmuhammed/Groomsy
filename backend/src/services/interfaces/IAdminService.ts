import { BarberDto, ListResponseDto, UserDto } from '../../dto/admin.dto';
import { IAdmin } from '../../models/admin.model'

export interface IAdminService {
    loginAdmin(
        email:string,
        password:string
    ):Promise<{ admin: IAdmin; token: string; message: string; status: number }>;
    listUsers(search: string): Promise<{ response: ListResponseDto<UserDto>, status: number;}>;
    listBarbers(search: string): Promise<{ response: ListResponseDto<BarberDto>, status: number;}>;
    blockUser(userId: string): Promise<{ response: UserDto, message: string, status: number;}>;
    unBlockUser(userId: string): Promise<{ response: UserDto, message: string, status: number;}>;
    blockBarber(barberId: string): Promise<{ response: BarberDto, message: string, status: number;}>;
    unBlockBarber(barberId: string): Promise<{ response: BarberDto, message: string, status: number;}>;
}