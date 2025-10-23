import fileUpload from "express-fileupload";
import { ListResponseDto, UserDto } from "../../dto/admin.dto";
import {
  BarberRegisterRequestDto,
  BarberLoginResponseDto,
  updateAddressDto,
  BarberProfileDto,
  UpdateBarberProfileDto,
  BarberDashboardStatsDto,
} from "../../dto/barber.dto";
import { MessageResponseDto } from "../../dto/base.dto";
import { DASHBOARDFILTERS } from "../../utils/constants";

export interface IBarberService {
  registerBarber(
    barberData: BarberRegisterRequestDto
  ): Promise<{ response: MessageResponseDto }>;
  verifyOTP(
    email: string,
    otp: string,
    purpose: "signup" | "forgot"
  ): Promise<{
    response: MessageResponseDto & { barber: { name: string; email: string } };
  }>;
  resendOTP(
    email: string,
    purpose: "signup" | "forgot"
  ): Promise<{
    response: MessageResponseDto & { user: { name: string } };
  }>;
  login(
    email: string,
    password: string
  ): Promise<{ response: BarberLoginResponseDto }>;
  forgotPassword(email: string): Promise<{ response: MessageResponseDto }>;
  resetPassword(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ response: MessageResponseDto }>;

  getBarberProfileById(
    barberId: string
  ): Promise<{ response: BarberProfileDto }>;
  updateBarberProfile(
    barberId: string,
    data: UpdateBarberProfileDto
  ): Promise<{ response: MessageResponseDto }>;
  updateBarberAddress(
    barberId: string,
    data: updateAddressDto
  ): Promise<{ response: MessageResponseDto }>;
  fetchUsers(
    search: string,
    page: number,
    limit: number
  ): Promise<{ response: ListResponseDto<UserDto> }>;
  getBookingStats(
    barberId: string,
    filter: DASHBOARDFILTERS
  ): Promise<{ dashboardStats: BarberDashboardStatsDto }>;
  updateBarberProfilePicture(
    barberId: string,
    file: fileUpload.UploadedFile
  ): Promise<{ profilePictureUpdation: MessageResponseDto }>;
  deleteBarberProfilePicture(
    barberId: string
  ): Promise<{ profilePictureDeletion: MessageResponseDto }>;
}
