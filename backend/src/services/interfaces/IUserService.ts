import { UserRegisterRequestDto,MessageResponseDto,UserLoginResponseDto } from "../../dto/user.dto";

export interface IUserService{
    registerUser( userData:UserRegisterRequestDto ): Promise<{ response:MessageResponseDto , status:number }>;
    verifyOTP(email:string,otp:string,purpose:'signup' | 'forgot'):Promise<{response:MessageResponseDto& { user: { name: string, email: string } }, status:number}>;
    resendOTP(email:string,purpose: 'signup' | 'forgot'):Promise<{response:MessageResponseDto& { user: { name: string } }, status:number}>;
    processGoogleAuth(profile:any):Promise<{response:UserLoginResponseDto, status:number}>;
    loginUser( email:string,password:string ) : Promise<{ response : UserLoginResponseDto, status : number }>;
    forgotPassword( email:string ) : Promise<{ response: MessageResponseDto, status: number}>;
    resetPassword( email: string, password: string, confirmPassword: string ) : Promise<{ response: MessageResponseDto, status: number}>;
}