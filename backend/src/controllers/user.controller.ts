import { Request, Response } from "express";
import { IUserController } from "./interfaces/IUserController";
import { IUserService } from "../services/interfaces/IUserService";
import { ROLES, STATUS_CODES } from "../utils/constants";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.generator";
import { injectable, inject } from "inversify";
import { TYPES } from "../config/types";
import fileUpload from "express-fileupload";

@injectable()
export class UserController implements IUserController {
  constructor(@inject(TYPES.IUserService) private _userService: IUserService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { response } = await this._userService.registerUser(req.body);
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

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
      const { response } = await this._userService.verifyOTP(
        email,
        otp,
        purpose
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

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

      const { response } = await this._userService.resendOTP(email, purpose);
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

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
      const user = req.user;
      const { response } = await this._userService.processGoogleAuth(user);

      const accessToken = generateAccessToken({
        userId: response.id,
        type: ROLES.USER,
      });
      const refreshToken = generateRefreshToken({
        userId: response.id,
        type: ROLES.USER,
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
      const { response } = await this._userService.loginUser(email, password);

      const accessToken = generateAccessToken({
        userId: response.id,
        type: ROLES.USER,
      });
      const refreshToken = generateRefreshToken({
        userId: response.id,
        type: ROLES.USER,
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

      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

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
      const { response } = await this._userService.forgotPassword(email);
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

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
      const { response } = await this._userService.resetPassword(
        email,
        password,
        confirmPassword
      );

      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
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

      const { response } = await this._userService.fetchAllBarbers(
        search,
        page,
        limit,
        district
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch barbers",
      });
    }
  };

  fetchBarbersAndSlotRules = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const barberId = req.params["barberId"];
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const { response } = await this._userService.fetchBarbersAndSlotRules(
        page,
        limit,
        barberId
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch slots and barber",
      });
    }
  };

  fetchBarberDetailsById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const barberId = req.params["id"];

      const { barberDetailsData } =
        await this._userService.fetchBarberDetailsById(barberId);

      let status;
      if (barberDetailsData) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      }

      res.status(status).json(barberDetailsData);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to barber details",
      });
    }
  };

  getUserProfileById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params["id"];

      const { response } = await this._userService.getUserProfileById(userId);
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch User Profile",
      });
    }
  };

  updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params["id"];
      const data = req.body;

      const { response } = await this._userService.updateUserProfile(
        userId,
        data
      );
      let status;

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to edit User Profile",
      });
    }
  };

  updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params["id"];
      if (!req.files || !req.files.file) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ error: "No file uploaded" });
        return;
      }
      const file = req.files.file as fileUpload.UploadedFile;

      const { profilePictureUpdation } =
        await this._userService.updateUserProfilePicture(userId, file);
      let status;
      if (profilePictureUpdation) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      }

      res.status(status).json(profilePictureUpdation);
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to Update User Profile Picture",
      });
    }
  };

  deleteProfilePicture = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params["id"];

      const { profilePictureDeletion } =
        await this._userService.deleteUserProfilePicture(userId);

      let status;
      if (profilePictureDeletion) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      }

      res.status(status).json(profilePictureDeletion);
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to Delete User Profile Picture",
      });
    }
  };
}
