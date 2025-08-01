import { Request, Response } from "express";
import { IUserController } from "./interfaces/IUserController";
import { IUserService } from "../services/interfaces/IUserService";
import { STATUS_CODES } from "../utils/constants";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.generator";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { response, status } = await this._userService.registerUser(
        req.body
      );

      res.status(status).json({
        response,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp, purpose } = req.body; // get purpose from frontend
      const { response, status } = await this._userService.verifyOTP(
        email,
        otp,
        purpose
      );

      res.status(status).json(response);
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "OTP verification failed",
      });
    }
  };

  resendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, purpose } = req.body;

      if (!email || !purpose) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Email and purpose are required",
        });
        return;
      }

      const { response, status } = await this._userService.resendOTP(
        email,
        purpose
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("OTP resend error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Failed to resend OTP",
      });
    }
  };

  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user as any;
      const { response, status } = await this._userService.processGoogleAuth(
        user
      );

      const accessToken = generateAccessToken({
        userId: response.id,
        type: "user",
      });
      const refreshToken = generateRefreshToken({
        userId: response.id,
        type: "user",
      });

      res.cookie("auth-token", accessToken, {
        httpOnly: process.env.AUTH_TOKEN_HTTP_ONLY === "true",
        secure: process.env.AUTH_TOKEN_SECURE === "true",
        sameSite: "lax",
        maxAge: Number(process.env.AUTH_TOKEN_MAX_AGE),
      });

      res.cookie("refresh-token", refreshToken, {
        httpOnly: process.env.REFRESH_TOKEN_HTTP_ONLY === "true",
        secure: process.env.REFRESH_TOKEN_SECURE === "true",
        sameSite: "strict",
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
      });

      res.redirect(
        `${
          process.env.FRONTEND_URL
        }/user/auth-callback?token=${accessToken}&name=${encodeURIComponent(
          response.name
        )}&id=${encodeURIComponent(response.id)}`
      );
    } catch (error) {
      console.error("Google auth error:", error);
      res.redirect(
        `${process.env.FRONTEND_URL}/user/signup?error=google_auth_failed`
      );
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("auth-token", { path: "/" });
    res.clearCookie("refresh-token", { path: "/" });

    res.status(STATUS_CODES.OK).json({
      message: "Logged out successfully",
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { response, status } = await this._userService.loginUser(
        email,
        password
      );

      const accessToken = generateAccessToken({
        userId: response.id,
        type: "user",
      });
      const refreshToken = generateRefreshToken({
        userId: response.id,
        type: "user",
      });

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

      res.status(status).json({
        message: response.message,
        user: {
          id: response.id,
          name: response.name,
          email: response.email,
          phone: response.phone,
          status: response.status,
          token: accessToken,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        error: error instanceof Error ? error.message : "Login Failed",
      });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const { response, status } = await this._userService.forgotPassword(
        email
      );
      res.status(status).json(response);
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to process forgot password request",
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, confirmPassword } = req.body;
      const { response, status } = await this._userService.resetPassword(
        email,
        password,
        confirmPassword
      );

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({
          error:
            error instanceof Error ? error.message : "Failed to reset password",
        });
    }
  };

  fetchAllBarbers = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;
      const district = (req.query.district as string) || "";

      const { response, status } = await this._userService.fetchAllBarbers(
        search,
        page,
        limit,
        district
      );

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({
          error:
            error instanceof Error ? error.message : "Failed to fetch barbers",
        });
    }
  };

  fetchBarbersAndSlots = async (req: Request, res: Response): Promise<void> =>{
    try {
      const barberId = req.params["barberId"]
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 5

      const { response,status } = await this._userService.fetchBarbersAndSlots(page,limit,barberId)

      res.status(status).json(response)
    } catch (error) {
      console.error(error);
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({
          error:
            error instanceof Error ? error.message : "Failed to fetch slots and barber",
        });
    }
  }
}
