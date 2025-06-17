import { Request,Response } from "express";
import { IAdminController } from "./interfaces/IAdminController";
import { IAdminService } from "../services/interfaces/IAdminService";
import { STATUS_CODES } from "../utils/constants";

export class AdminController implements IAdminController{

    constructor(
        private readonly adminService : IAdminService
    ){}

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const {email,password} = req.body
            const result  = await this.adminService.loginAdmin(email,password)
            res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
        path: "/",
      });
      res.status(result.status).json({
        message: result.message,
        token: result.token,
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
    res.clearCookie("auth-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(STATUS_CODES.OK).json({
      message: "Logged out successfully",
    });
  };
}