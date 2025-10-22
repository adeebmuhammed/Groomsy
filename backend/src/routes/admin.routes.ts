import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { container } from "../config/inversify";
import { TYPES } from "../config/types";
import { IAdminController } from "../controllers/interfaces/IAdminController";
import { IBookingController } from "../controllers/interfaces/IBookingController";
import { ICouponController } from "../controllers/interfaces/ICouponController";
import { IOfferController } from "../controllers/interfaces/IOfferController";
import { IServiceController } from "../controllers/interfaces/IServiceController";
import { ISubscriptionPlanController } from "../controllers/interfaces/ISubscriptionPlanController";
import { ROLES } from "../utils/constants";

const adminRoutes = Router()
const adminAuth = authMiddleware([ROLES.ADMIN])

const adminController = container.get<IAdminController>(TYPES.IAdminController)
const bookingController = container.get<IBookingController>(TYPES.IBookingController)
const couponController = container.get<ICouponController>(TYPES.ICouponController)
const offerController = container.get<IOfferController>(TYPES.IOfferController)
const serviceController = container.get<IServiceController>(TYPES.IServiceController)
const planController = container.get<ISubscriptionPlanController>(TYPES.ISubscriptionPlanController)

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
.get('/bookings', adminAuth,bookingController.getBookingsByStatus)

adminRoutes
.get("/offers", adminAuth,offerController.getAllOffers)
.post("/offers", adminAuth,offerController.create)
.put("/offers/:id", adminAuth,offerController.edit)
.delete("/offers/:id", adminAuth,offerController.delete)

adminRoutes
.get("/service/:id",adminAuth,serviceController.getServiceById)
.get("/service", adminAuth,serviceController.fetch)
.post("/service", adminAuth,serviceController.create)
.put("/service/:id", adminAuth,serviceController.edit)
.delete("/service/:id", adminAuth,serviceController.delete)

adminRoutes
.get("/subscription",adminAuth,planController.getSubscriptionPlans)
.post("/subscription",adminAuth,planController.create)
.patch("/subscription/:id",adminAuth,planController.updateActivation)

adminRoutes
.get("/dashboard-stats",adminAuth,adminController.getAdminDashboardStats)

export default adminRoutes;