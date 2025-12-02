import { Request, Response } from "express";
import { IBarberController } from "./interfaces/IBarberController";
import { DASHBOARDFILTERS, ROLES, STATUS_CODES } from "../utils/constants";
import {
  generateRefreshToken,
} from "../utils/jwt.generator";
import { IBarberService } from "../services/interfaces/IBarberService";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import fileUpload from "express-fileupload";

@injectable()
export class BarberController implements IBarberController {
  constructor(
    @inject(TYPES.IBarberService) private _barberService: IBarberService
  ) {}

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { response } = await this._barberService.registerBarber(req.body);
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
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp, purpose } = req.body;
      const { response } = await this._barberService.verifyOTP(
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
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "OTP Verification failed",
      });
    }
  };

  resendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, purpose } = req.body;

      const { response } = await this._barberService.resendOTP(email, purpose);

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
        error: error instanceof Error ? error.message : "OTP resend failed",
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      let { response } = await this._barberService.login(email, password);

      const refreshToken = generateRefreshToken({
        userId: response.id,
        type: ROLES.BARBER,
      });

      res.cookie("auth-token", response.token, {
        httpOnly: process.env.AUTH_TOKEN_HTTP_ONLY === "true",
        secure: process.env.AUTH_TOKEN_SECURE === "true",
        sameSite: process.env.AUTH_TOKEN_SAME_SITE as "lax" | "strict" | "none",
        maxAge: Number(process.env.AUTH_TOKEN_MAX_AGE),
      });

      res.cookie("refresh-token", refreshToken, {
        httpOnly: process.env.REFRESH_TOKEN_HTTP_ONLY === "true",
        secure: process.env.REFRESH_TOKEN_SECURE === "true",
        sameSite: process.env.REFRESH_TOKEN_SAME_SITE as "lax" | "strict" | "none",
        maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
      });

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
        error: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const { response } = await this._barberService.forgotPassword(email);

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
          error instanceof Error ? error.message : "forgot password failed",
      });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, confirmPassword } = req.body;
      const { response } = await this._barberService.resetPassword(
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
        error: error instanceof Error ? error.message : "reset password failed",
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("auth-token", { path: "/" });
    res.clearCookie("refresh-token", { path: "/" });

    res.status(STATUS_CODES.OK).json({
      message: "Logged out successfully",
    });
  };

  getBarberProfileById = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.params["barberId"];

      const { response } = await this._barberService.getBarberProfileById(
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
            : "Failed to fetch Barber Profile",
      });
    }
  };

  updateBarberProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.params["barberId"];
      const data = req.body;

      const { response } = await this._barberService.updateBarberProfile(
        barberId,
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
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to Upadte Barber Profile",
      });
    }
  };

  updateBarberAddress = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.params["barberId"];
      const data = req.body;

      const { response } = await this._barberService.updateBarberAddress(
        barberId,
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
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to Update Barber Address",
      });
    }
  };

  fetchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      let status;

      const { response } = await this._barberService.fetchUsers(
        search,
        page,
        limit
      );

      if (response) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.CONFLICT;
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Fetching Users Failed",
      });
    }
  };

  getBarberDashboardStats = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const barberId = req.params["barberId"];
      const filterParam = req.query.filter as string | undefined;
      let status;

      const filter: DASHBOARDFILTERS =
        filterParam === DASHBOARDFILTERS.WEEK ||
        filterParam === DASHBOARDFILTERS.MONTH ||
        filterParam === DASHBOARDFILTERS.YEAR
          ? (filterParam as DASHBOARDFILTERS)
          : DASHBOARDFILTERS.WEEK;

      const { dashboardStats } = await this._barberService.getDashboardStats(
        barberId,
        filter
      );

      if (dashboardStats) {
        status = STATUS_CODES.OK;
      } else {
        status = STATUS_CODES.INTERNAL_SERVER_ERROR;
      }

      res.status(status).json(dashboardStats);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Barber Dashboard stats",
      });
    }
  };

  updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.params["barberId"];
      const { profilePicUrl, profilePicKey } = req.body;

      const { profilePictureUpdation } =
        await this._barberService.updateBarberProfilePicture(barberId, profilePicUrl, profilePicKey);
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
            : "Failed to Update Barber Profile Picture",
      });
    }
  };

  deleteProfilePicture = async (req: Request, res: Response): Promise<void> => {
    try {
      const barberId = req.params["barberId"]

      const { profilePictureDeletion } = await this._barberService.deleteBarberProfilePicture(barberId)

      let status;
      if (profilePictureDeletion) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.INTERNAL_SERVER_ERROR
      }

      res.status(status).json(profilePictureDeletion)
    } catch (error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to Delete Barber Profile Picture",
      });
    }
  }
}
