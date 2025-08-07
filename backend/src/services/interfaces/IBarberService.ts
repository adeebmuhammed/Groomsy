import { BarberRegisterRequestDto, BarberLoginResponseDto } from "../../dto/barber.dto";
import { MessageResponseDto } from "../../dto/base.dto";

export interface IBarberService {
    registerBarber( barberData: BarberRegisterRequestDto): Promise<{ response: MessageResponseDto, status: number}>;
    verifyOTP(email:string,otp:string,purpose:'signup' | 'forgot'):Promise<{response:MessageResponseDto& { barber: { name: string, email: string } }, status:number}>;
    resendOTP(email:string,purpose: 'signup' | 'forgot'):Promise<{response:MessageResponseDto& { user: { name: string } }, status:number}>;
    login(email: string, password: string): Promise<{response: BarberLoginResponseDto, status: number}>
    forgotPassword( email:string ) : Promise<{ response: MessageResponseDto, status: number}>;
    resetPassword( email: string, password: string, confirmPassword: string ) : Promise<{ response: MessageResponseDto, status: number}>;
}