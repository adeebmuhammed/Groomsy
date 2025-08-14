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
import { BookingController } from "../controllers/booking.controller";
import { BookingRepository } from "../repositories/booking.repository";
import { BookingService } from "../services/booking.service";
import { OfferRepository } from "../repositories/offer.repository";
import { OfferService } from "../services/offer.service";
import { OfferController } from "../controllers/offer.controller";
import { ServiceRepository } from "../repositories/service.repository";
import { ServiceService } from "../services/service.service";
import { ServiceController } from "../controllers/service.controller";
import { SubscriptionPlanController } from "../controllers/subscription.plan.controller";
import { SubscriptionPlanRepository } from "../repositories/subscription.plan.repository";
import { SubscriptionPlanService } from "../services/subscription.plan.service";

const adminRoutes = Router()
const adminAuth = authMiddleware(["admin"])

const adminRepo = new AdminRepository()
const userRepo = new UserRepository()
const barberRepo = new BarberRepository()
const adminService = new AdminService(adminRepo,userRepo,barberRepo);
const adminController = new AdminController(adminService)

const bookingRepo = new BookingRepository()
const bookingService = new BookingService(bookingRepo)
const bookingController = new BookingController(bookingService)

const couponRepo = new CouponResitory()
const couponService = new CouponService(couponRepo)
const couponController = new CouponController(couponService)

const offerRepo = new OfferRepository()
const offerService = new OfferService(offerRepo)
const offerController = new OfferController(offerService)

const serviceRepo = new ServiceRepository
const serviceService = new ServiceService(serviceRepo)
const serviceController = new ServiceController(serviceService)

const planRepo = new SubscriptionPlanRepository()
const planService = new SubscriptionPlanService(planRepo)
const planController = new SubscriptionPlanController(planService)

adminRoutes.post('/login',adminController.login)
adminRoutes.post('/logout',adminController.logout)

adminRoutes
.get('/users', adminAuth, adminController.listUsers)
.patch('/update-user-status/:id', adminAuth, adminController.updateUserStatus)

adminRoutes
.get('/barbers', adminAuth, adminController.listBarbers)
.patch('/update-barber-status/:id', adminAuth, adminController.updateBarberStatus)

adminRoutes
.get("/coupons", adminAuth,couponController.getAllCoupons)
.post("/coupons", adminAuth,couponController.createCoupon)
.put("/coupons/:id", adminAuth,couponController.updateCoupon)
.delete("/coupons/:id", adminAuth,couponController.deleteCoupon)

adminRoutes
.get('/bookings', adminAuth,bookingController.fetchBookings)

adminRoutes
.get("/offers", adminAuth,offerController.getAllOffers)
.post("/offers", adminAuth,offerController.create)
.put("/offers/:id", adminAuth,offerController.edit)
.delete("/offers/:id", adminAuth,offerController.delete)

adminRoutes
.get("/service", adminAuth,serviceController.fetch)
.post("/service", adminAuth,serviceController.create)
.put("/service/:id", adminAuth,serviceController.edit)
.delete("/service/:id", adminAuth,serviceController.delete)

adminRoutes
.get("/subscription",planController.getSubscriptionPlans)
.post("/subscription",planController.create)
.patch("/subscription/:id",planController.updateActivation)

export default adminRoutes;