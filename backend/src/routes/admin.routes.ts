import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AdminController } from "../controllers/admin.controller";
import { AdminService } from "../services/admin.service";
import { AdminRepository } from "../repositories/admin.repository";

const adminRoutes = Router()
const adminAuth = authMiddleware(["admin"])

const adminRepo = new AdminRepository()
const adminService = new AdminService(adminRepo);
const adminController = new AdminController(adminService)

adminRoutes.post('/login',adminController.login)
adminRoutes.post('/logout',adminController.logout)

export default adminRoutes;