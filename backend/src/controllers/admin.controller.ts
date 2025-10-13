import { Request, response, Response } from "express";
import { IAdminController } from "./interfaces/IAdminController";
import { IAdminService } from "../services/interfaces/IAdminService";
import { STATUS_CODES } from "../utils/constants";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.generator";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.IAdminService) private _adminService: IAdminService
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this._adminService.loginAdmin(email, password);

      const accessToken = generateAccessToken({
        userId: result.response.id,
        type: "admin",
      });
      const refreshToken = generateRefreshToken({
        userId: result.response.id,
        type: "admin",
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

      res.status(STATUS_CODES.OK).json({
        message: result.response.message,
        token: accessToken,
        user: {
          id: result.response.id,
          name: result.response.name,
          email: result.response.email,
        },
        role: "admin",
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        error: error instanceof Error ? error.message : "Login Failed",
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

  listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      let status;

      const { response } = await this._adminService.listUsers(
        search,
        page,
        limit
      );

      if (response) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Fetching Users Failed",
      });
    }
  };

  listBarbers = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search as string) || "";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      let status;

      const { response } = await this._adminService.listBarbers(
        search,
        page,
        limit
      );

      if (response) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(response);
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Fetching Barbers Failed",
      });
    }
  };

  updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: userId } = req.params;
      const { status } = req.body;
      let statusCode;

      let result;
      if (status === "active") {
        result = await this._adminService.blockUser(userId);
      } else if (status === "blocked") {
        result = await this._adminService.unBlockUser(userId);
      } else {
        throw new Error("Invalid status");
      }

      if (result) {
        statusCode = STATUS_CODES.OK
      }else{
        statusCode = STATUS_CODES.CONFLICT
      }

      res.status(statusCode).json({
        message: result.message,
        user: result.response,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "user status update Failed",
      });
    }
  };

  updateBarberStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id: barberId } = req.params;
      const { status } = req.body;
      let statusCode;

      let result;
      if (status === "active") {
        result = await this._adminService.blockBarber(barberId);
      } else if (status === "blocked") {
        result = await this._adminService.unBlockBarber(barberId);
      } else {
        throw new Error("Invalid status");
      }

      if (result) {
        statusCode = STATUS_CODES.OK
      }else{
        statusCode = STATUS_CODES.CONFLICT
      }

      res.status(statusCode).json({
        message: result.message,
        barber: result.response,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "barber status update Failed",
      });
    }
  };

  getAdminDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { dashboardStats } = await this._adminService.getAdminDashboardStats()
      let status;

      if (dashboardStats) {
        status = STATUS_CODES.OK
      }else{
        status = STATUS_CODES.CONFLICT
      }

      res.status(status).json(dashboardStats)
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "barber status update Failed",
      });
    }
  }
}
