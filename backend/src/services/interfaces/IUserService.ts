import { ListResponseDto } from "../../dto/admin.dto";
import { BarberDto, BarberProfileDto } from "../../dto/barber.dto";
import { SlotResponseDto, SlotRuleListResponseDto } from "../../dto/slot.dto";
import {
  UserRegisterRequestDto,
  UserLoginResponseDto,
  UserProfileDto,
  UserEditProfileDto,
} from "../../dto/user.dto";
import { MessageResponseDto } from "../../dto/base.dto";
import fileUpload from "express-fileupload";

export interface IUserService {
  registerUser(
    userData: UserRegisterRequestDto
  ): Promise<{ response: MessageResponseDto }>;
  verifyOTP(
    email: string,
    otp: string,
    purpose: "signup" | "forgot"
  ): Promise<{
    response: MessageResponseDto & { user: { name: string; id: string } };
  }>;
  resendOTP(
    email: string,
    purpose: "signup" | "forgot"
  ): Promise<{ response: MessageResponseDto & { user: { name: string } } }>;
  processGoogleAuth(profile: any): Promise<{ response: UserLoginResponseDto }>;
  loginUser(
    email: string,
    password: string
  ): Promise<{ response: UserLoginResponseDto }>;
  forgotPassword(email: string): Promise<{ response: MessageResponseDto }>;
  resetPassword(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ response: MessageResponseDto }>;

  fetchAllBarbers(
    search: string,
    page: number,
    limit: number,
    district: string
  ): Promise<{ response: ListResponseDto<BarberDto> }>;
  fetchBarbersAndSlotRules(
    page: number,
    limit: number,
    barberId: string
  ): Promise<{ response: SlotRuleListResponseDto }>;
  fetchBarberDetailsById(
    barberId: string
  ): Promise<{ barberDetailsData: BarberProfileDto }>;

  getUserProfileById(userId: string): Promise<{ response: UserProfileDto }>;
  updateUserProfile(
    userId: string,
    data: UserEditProfileDto
  ): Promise<{ response: MessageResponseDto }>;
  updateUserProfilePicture(
    userId: string,
    file: fileUpload.UploadedFile
  ): Promise<{ profilePictureUpdation: MessageResponseDto }>;
  deleteUserProfilePicture(
    userId: string
  ): Promise<{ profilePictureDeletion: MessageResponseDto }>;
}
