import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AdminController } from "../controllers/admin.controller";
import { AdminService } from "../services/admin.service";
import { AdminRepository } from "../repositories/admin.repository";
import { UserRepository } from "../repositories/user.repository";
import { BarberRepository } from "../repositories/barber.repository";

const adminRoutes = Router()
const adminAuth = authMiddleware(["admin"])

const adminRepo = new AdminRepository()
const userRepo = new UserRepository()
const barberRepo = new BarberRepository()
const adminService = new AdminService(adminRepo,userRepo,barberRepo);
const adminController = new AdminController(adminService)

adminRoutes.post('/login',adminController.login)
adminRoutes.post('/logout',adminController.logout)

adminRoutes.get('/users', adminAuth, adminController.listUsers)
adminRoutes.get('/barbers', adminAuth, adminController.listBarbers)

export default adminRoutes;