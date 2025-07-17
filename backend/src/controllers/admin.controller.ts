import { Request,Response } from "express";
import { IAdminController } from "./interfaces/IAdminController";
import { IAdminService } from "../services/interfaces/IAdminService";
import { STATUS_CODES } from "../utils/constants";
import { generateAccessToken,generateRefreshToken } from "../utils/jwt.generator";

export class AdminController implements IAdminController{

    constructor(
        private _adminService : IAdminService
    ){}

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const {email,password} = req.body
            const result  = await this._adminService.loginAdmin(email,password)

      const accessToken = generateAccessToken({ userId: result.admin._id, type: "admin" });
      const refreshToken = generateRefreshToken({ userId: result.admin._id, type: "admin" });
      
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

      res.status(result.status).json({
        message: result.message,
        token: accessToken,
        user: {
          id: result.admin._id,
          name: result.admin.name,
          email: result.admin.email,
        },
        role:"admin"
      });
        } catch (error) {
            console.error(error);
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        error: error instanceof Error ? error.message : "Login Failed",
      });
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
      res.clearCookie("auth-token", { path: "/" });
      res.clearCookie("refresh-token", { path: "/" });
      
      res.status(STATUS_CODES.OK).json({
        message: "Logged out successfully",
      });
    };

  listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const search = (req.query.search) as string || "";
      const { response, status } = await this._adminService.listUsers(search)

      res.status(status).json(response)
    } catch (error) {
      console.error(error)
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "Fetching Users Failed"})
    }
  }

  listBarbers = async (req: Request, res: Response): Promise<void> =>{
    try {
      const search = (req.query.search) as string || ""
      const { response,status } = await this._adminService.listBarbers(search)

      res.status(status).json(response)
    } catch (error) {
      console.error(error)
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "Fetching Barbers Failed"})
    }
  }

  updateUserStatus = async (req: Request, res: Response): Promise<void> =>{
    try {
      const { id: userId } = req.params
      const { status } = req.body

      let result;
      if (status === "active") {
        result = await this._adminService.blockUser(userId);
      } else if (status === "blocked") {
        result = await this._adminService.unBlockUser(userId);
      } else {
        throw new Error("Invalid status");
      }

      res.status(result.status).json({
        message: result.message,
        user: result.response
      })
    } catch (error) {
      console.error(error)
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "user status update Failed"})
    }
  }

  updateBarberStatus = async (req: Request, res: Response): Promise<void> =>{
    try {
      const { id: barberId } = req.params
      const { status } = req.body

      let result;
      if (status === "active") {
        result = await this._adminService.blockBarber(barberId);
      } else if (status === "blocked") {
        result = await this._adminService.unBlockBarber(barberId);
      } else {
        throw new Error("Invalid status");
      }

      res.status(result.status).json({
        message: result.message,
        barber: result.response
      })
    } catch (error) {
      console.error(error)
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({error: error instanceof Error ? error.message : "barber status update Failed"})
    }
  }
}