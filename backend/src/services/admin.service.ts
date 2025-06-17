import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { IAdmin } from "../models/admin.model";
import { IAdminService } from "./interfaces/IAdminService";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { MESSAGES,STATUS_CODES } from "../utils/constants";
import { isValidEmail } from "../utils/validators";

export class AdminService implements IAdminService{

    constructor(
        private adminRepo:IAdminRepository
    ){}


    async loginAdmin(email: string, password: string): Promise<{ admin: IAdmin; token: string; message: string; status: number; }> {
        if (!isValidEmail(email)) {
            throw new Error("invalid email format");
        }
        
        if (!password) {
            throw new Error("password is required");
        }
        

        const admin = await this.adminRepo.findByEmail(email)
        
        if (!admin) {
            throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
        }

        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
        }

        const token = jwt.sign({ userId: admin._id, type: "admin" }, jwtSecret, {
            expiresIn: "1h",
        });

        return {
            admin,
            token,
            message: MESSAGES.SUCCESS.LOGIN,
            status: STATUS_CODES.OK,
        };
    }
}