import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AdminController } from "../controllers/admin.controller";
import { AdminService } from "../services/admin.service";
import { AdminRepository } from "../repositories/admin.repository";
import { UserRepository } from "../repositories/user.repository";
import { BarberRepository } from "../repositories/barber.repository";
import { CouponController } from "../controllers/coupon.controller";
import { CouponResitory } from "../repositories/coupon.repository";
import { CouponService } from "../services/coupon.service";

const adminRoutes = Router()
const adminAuth = authMiddleware(["admin"])

const adminRepo = new AdminRepository()
const userRepo = new UserRepository()
const barberRepo = new BarberRepository()
const adminService = new AdminService(adminRepo,userRepo,barberRepo);
const adminController = new AdminController(adminService)

adminRoutes.post('/login',adminController.login)
adminRoutes.post('/logout',adminController.logout)

adminRoutes
.get('/users', adminAuth, adminController.listUsers)
.patch('/update-user-status/:id', adminAuth, adminController.updateUserStatus)

adminRoutes
.get('/barbers', adminAuth, adminController.listBarbers)
.patch('/update-barber-status/:id', adminAuth, adminController.updateBarberStatus)

const couponRepo = new CouponResitory()
const couponService = new CouponService(couponRepo)
const couponController = new CouponController(couponService)

adminRoutes
.get("/coupons", adminAuth,couponController.getAllCoupons)
.post("/coupons", adminAuth,couponController.createCoupon)
.put("/coupons/:id", adminAuth,couponController.updateCoupon)
.delete("/coupons/:id", adminAuth,couponController.deleteCoupon)

export default adminRoutes;