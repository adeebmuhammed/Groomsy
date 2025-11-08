"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const inversify_1 = require("../config/inversify");
const types_1 = require("../config/types");
const constants_1 = require("../utils/constants");
const adminRoutes = (0, express_1.Router)();
const adminAuth = (0, auth_middleware_1.authMiddleware)([constants_1.ROLES.ADMIN]);
const adminController = inversify_1.container.get(types_1.TYPES.IAdminController);
const bookingController = inversify_1.container.get(types_1.TYPES.IBookingController);
const couponController = inversify_1.container.get(types_1.TYPES.ICouponController);
const offerController = inversify_1.container.get(types_1.TYPES.IOfferController);
const serviceController = inversify_1.container.get(types_1.TYPES.IServiceController);
const planController = inversify_1.container.get(types_1.TYPES.ISubscriptionPlanController);
adminRoutes.post('/login', adminController.login);
adminRoutes.post('/logout', adminController.logout);
adminRoutes
    .get('/users', adminAuth, adminController.listUsers)
    .patch('/update-user-status/:id', adminAuth, adminController.updateUserStatus);
adminRoutes
    .get('/barbers', adminAuth, adminController.listBarbers)
    .patch('/update-barber-status/:id', adminAuth, adminController.updateBarberStatus);
adminRoutes
    .get("/coupons", adminAuth, couponController.getAllCoupons)
    .post("/coupons", adminAuth, couponController.createCoupon)
    .put("/coupons/:id", adminAuth, couponController.updateCoupon)
    .delete("/coupons/:id", adminAuth, couponController.deleteCoupon);
adminRoutes
    .get('/bookings', adminAuth, bookingController.getBookingsByStatus);
adminRoutes
    .get("/offers", adminAuth, offerController.getAllOffers)
    .post("/offers", adminAuth, offerController.create)
    .put("/offers/:id", adminAuth, offerController.edit)
    .delete("/offers/:id", adminAuth, offerController.delete);
adminRoutes
    .get("/service/:id", adminAuth, serviceController.getServiceById)
    .get("/service", adminAuth, serviceController.fetch)
    .post("/service", adminAuth, serviceController.create)
    .put("/service/:id", adminAuth, serviceController.edit)
    .delete("/service/:id", adminAuth, serviceController.delete);
adminRoutes
    .get("/subscription", adminAuth, planController.getSubscriptionPlans)
    .post("/subscription", adminAuth, planController.create)
    .patch("/subscription/:id", adminAuth, planController.updateActivation);
adminRoutes
    .get("/dashboard-stats", adminAuth, adminController.getAdminDashboardStats);
exports.default = adminRoutes;
