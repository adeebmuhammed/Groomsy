"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const subscription_middleware_1 = require("../middlewares/subscription.middleware");
const inversify_1 = require("../config/inversify");
const types_1 = require("../config/types");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const constants_1 = require("../utils/constants");
const barberRoutes = (0, express_1.Router)();
const barberAuth = (0, auth_middleware_1.authMiddleware)([constants_1.ROLES.BARBER]);
const multiAuth = (0, auth_middleware_1.authMiddleware)([constants_1.ROLES.USER, constants_1.ROLES.BARBER]);
const barberController = inversify_1.container.get(types_1.TYPES.IBarberController);
const slotController = inversify_1.container.get(types_1.TYPES.ISlotController);
const bookingController = inversify_1.container.get(types_1.TYPES.IBookingController);
const barberUnavailabilityController = inversify_1.container.get(types_1.TYPES.IBarberUnavailabilityController);
const subscriptionController = inversify_1.container.get(types_1.TYPES.ISubscriptionController);
const planController = inversify_1.container.get(types_1.TYPES.ISubscriptionPlanController);
const serviceController = inversify_1.container.get(types_1.TYPES.IServiceController);
barberRoutes
    .post('/signup', barberController.signup)
    .post('/verify-otp', barberController.verifyOTP)
    .post('/resend-otp', barberController.resendOTP)
    .post('/login', barberController.login)
    .post('/forgot-password', barberController.forgotPassword)
    .post('/reset-password', barberController.resetPassword)
    .post('/logout', barberController.logout);
barberRoutes
    .get('/slots', barberAuth, slotController.getSlotRulesByBarber)
    .post('/slots', barberAuth, (0, subscription_middleware_1.subscriptionMiddleware)("Slots"), slotController.createSlotRule)
    .put('/slots/:slotId', barberAuth, (0, subscription_middleware_1.subscriptionMiddleware)("Slots"), slotController.updateSlotRule)
    .delete('/slots/:slotId', barberAuth, (0, subscription_middleware_1.subscriptionMiddleware)("Slots"), slotController.deleteSlotRule);
barberRoutes
    .get('/bookings', multiAuth, bookingController.getBookingsByStatus)
    .patch("/bookings/:bookingId", barberAuth, (0, subscription_middleware_1.subscriptionMiddleware)("Bookings"), bookingController.updateBookingStatus);
barberRoutes
    .get("/barber-unavailability/:barberId", barberAuth, barberUnavailabilityController.fetchBarberUnavailability)
    .patch("/barber-unavailability/weekly/:barberId", barberAuth, (0, subscription_middleware_1.subscriptionMiddleware)("Unavailability"), barberUnavailabilityController.editWeeklyDayOff)
    .post("/barber-unavailability/special/:barberId", barberAuth, (0, subscription_middleware_1.subscriptionMiddleware)("Unavailability"), barberUnavailabilityController.addOffDay)
    .delete("/barber-unavailability/special/:barberId", barberAuth, (0, subscription_middleware_1.subscriptionMiddleware)("Unavailability"), barberUnavailabilityController.removeOffDay);
barberRoutes
    .get("/subscription/plans", planController.getPlansForBarber)
    .get("/subscription/plan/:planId", planController.getPlanById)
    .get("/subscription/:barberId", barberAuth, subscriptionController.getSubscriptionDetailsByBarber)
    .post("/subscription", barberAuth, subscriptionController.manageSubscription)
    .put("/subscription", barberAuth, subscriptionController.renewSubscription)
    .post("/subscription/verify-payment", barberAuth, subscriptionController.verifySubscriptionPayment);
barberRoutes
    .get("/profile/:barberId", barberAuth, barberController.getBarberProfileById)
    .patch("/profile/address/:barberId", barberAuth, barberController.updateBarberAddress)
    .put("/profile/:barberId", barberAuth, barberController.updateBarberProfile)
    .patch("/profile/update-profile-picture/:barberId", (0, express_fileupload_1.default)(), barberController.updateProfilePicture)
    .delete("/profile/delete-profile-picture/:barberId", barberController.deleteProfilePicture);
barberRoutes
    .get("/users", barberAuth, barberController.fetchUsers);
barberRoutes
    .get("/service/:serviceId", barberAuth, serviceController.getServiceById);
barberRoutes
    .get('/bookings', barberAuth, bookingController.getBookingsByStatus);
barberRoutes
    .get("/dashboard-stats/:barberId", barberController.getBarberDashboardStats);
exports.default = barberRoutes;
