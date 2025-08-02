import { ListResponseDto } from "../../dto/admin.dto";
import { BarberDto } from "../../dto/barber.dto";
import { SlotResponseDto, SlotRuleListResponseDto } from "../../dto/slot.dto";
import { UserRegisterRequestDto,MessageResponseDto,UserLoginResponseDto } from "../../dto/user.dto";

export interface IUserService{
    registerUser( userData:UserRegisterRequestDto ): Promise<{ response:MessageResponseDto , status:number }>;
    verifyOTP(email:string,otp:string,purpose:'signup' | 'forgot'):Promise<{response:MessageResponseDto& { user: { name: string, id: string } }, status:number}>;
    resendOTP(email:string,purpose: 'signup' | 'forgot'):Promise<{response:MessageResponseDto& { user: { name: string } }, status:number}>;
    processGoogleAuth(profile:any):Promise<{response:UserLoginResponseDto, status:number}>;
    loginUser( email:string,password:string ) : Promise<{ response : UserLoginResponseDto, status : number }>;
    forgotPassword( email:string ) : Promise<{ response: MessageResponseDto, status: number}>;
    resetPassword( email: string, password: string, confirmPassword: string ) : Promise<{ response: MessageResponseDto, status: number}>;

    fetchAllBarbers(search: string,page: number,limit: number,district: string):Promise<{ response: ListResponseDto<BarberDto>, status: number}>
    fetchBarbersAndSlotRules(page: number,limit: number,barberId: string):Promise<{ response: SlotRuleListResponseDto, status: number}>
}