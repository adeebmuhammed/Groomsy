import { Request,Response } from "express";
import { IUserController } from "./interfaces/IUserController";
import { IUserService } from "../services/interfaces/IUserService";
import { STATUS_CODES } from "../utils/constants";

export class UserController implements IUserController{

    constructor(private userService:IUserService){}

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { response,status } = await this.userService.registerUser(req.body);

            res.status(status).json({
                response,
                
            })
        } catch (error) {
            console.error("Registration error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                error: error instanceof Error ? error.message : "Registration failed",
            });
        }
    }

    verifyOTP = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, otp } = req.body;
            const { response, status } = await this.userService.verifyOTP(email, otp);

            res.status(status).json(response);
        } catch (error) {
            console.error("OTP verification error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                error: error instanceof Error ? error.message : "OTP verification failed",
            });
        }
    }

    resendOTP = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body

            if (!email) {
                res.status(STATUS_CODES.BAD_REQUEST).json({
                    error: "Email is required",
                });
                return;
            }

            const { response,status } = await this.userService.resendOTP(email)
            res.status(status).json(response)
        } catch (error) {
            console.error("OTP resend error:", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({
                error: error instanceof Error ? error.message : "Failed to resend OTP",
            });
        }
    }

    googleCallback = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = req.user as any
            const { response,status } = await this.userService.processGoogleAuth(user)

            res.cookie("auth-token", response.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600000,
                path: "/",
            });

            res.redirect(`${process.env.FRONTEND_URL}/user/home?token=${response.token}&name=${encodeURIComponent(response.name)}`);
        } catch (error) {
            console.error("Google auth error:", error);
            res.redirect(`${process.env.FRONTEND_URL}/user/login?error=google_auth_failed`);
        }
    }

    logout = async (req: Request, res: Response): Promise<void> =>{
        res.clearCookie("auth-token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.status(STATUS_CODES.OK).json({
            message: "Logged out successfully",
        });
    }
}