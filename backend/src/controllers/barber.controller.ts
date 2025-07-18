import { Request, response, Response } from "express";
import { IBarberController } from "./interfaces/IBarberController";
import { BarberService } from "../services/barber.service";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { generateAccessToken,generateRefreshToken } from "../utils/jwt.generator";

export class BarberController implements IBarberController{

    constructor( private _barberService: BarberService){}

    signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const { response,status } = await this._barberService.registerBarber(req.body)

            res.status(status).json(response)
        } catch (error) {
            console.error(error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "Registration failed"})
        }
    }

    verifyOTP = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email,otp,purpose } = req.body
            const { response,status } = await this._barberService.verifyOTP(email,otp,purpose)

            res.status(status).json(response)
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "OTP Verification failed"})
        }
    }

    resendOTP = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email,purpose } = req.body

            const { response,status } = await this._barberService.resendOTP(email, purpose)
            res.status(status).json(response)
        } catch (error) {
            console.error(error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "OTP resend failed"})
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password} = req.body
            const { response, status } = await this._barberService.login(email, password)

            const accessToken = generateAccessToken({ userId: response.id, type: "barber" });
                  const refreshToken = generateRefreshToken({ userId: response.id, type: "barber" });
                  
                  res.cookie("auth-token", accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 60 * 60 * 1000, // 1 hour
                  });
                  
                  res.cookie("refresh-token", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                  });

            res.status(status).json(response)
        } catch (error) {
            console.error(error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "Login failed"})
        }
    }

    forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body
            const { response, status } = await this._barberService.forgotPassword(email)

            res.status(status).json(response)
        } catch (error) {
            console.error(error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "forgot password failed"})
        }
    }

    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, confirmPassword } = req.body
            const { response, status } = await this._barberService.resetPassword(email, password, confirmPassword)

            res.status(status).json(response)
        } catch (error) {
            console.error(error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "reset password failed"})
        }
    }

    logout = async (req: Request, res: Response): Promise<void> =>{
        res.clearCookie("auth-token", { path: "/" });
        res.clearCookie("refresh-token", { path: "/" });

        res.status(STATUS_CODES.OK).json({
            message: "Logged out successfully",
        });
    }
}