import { IUser } from "../../models/user.model";
import { UserRegisterRequestDto,MessageResponseDto,UserLoginResponseDto } from "../../dto/user.dto";

export interface IUserService{
    registerUser( userData:UserRegisterRequestDto ): Promise<{ response:MessageResponseDto , status:number }>;
    verifyOTP(email:string,otp:string):Promise<{response:MessageResponseDto& { user: { name: string } }, status:number}>;
    resendOTP(email:string):Promise<{response:MessageResponseDto& { user: { name: string } }, status:number}>;
    processGoogleAuth(profile:any):Promise<{response:UserLoginResponseDto, status:number}>;
}