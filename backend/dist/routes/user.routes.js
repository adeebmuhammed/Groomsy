"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const passport_1 = __importDefault(require("../config/passport"));
const isBlocked_middleware_1 = require("../middlewares/isBlocked.middleware");
const inversify_1 = require("../config/inversify");
const types_1 = require("../config/types");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const constants_1 = require("../utils/constants");
const userRoutes = (0, express_1.Router)();
const userAuth = (0, auth_middleware_1.authMiddleware)([constants_1.ROLES.USER]);
const userController = inversify_1.container.get(types_1.TYPES.IUserController);
const bookingController = inversify_1.container.get(types_1.TYPES.IBookingController);
const favoritesController = inversify_1.container.get(types_1.TYPES.IFavoritesController);
const slotController = inversify_1.container.get(types_1.TYPES.ISlotController);
const serviceController = inversify_1.container.get(types_1.TYPES.IServiceController);
const barberUnavailabilityController = inversify_1.container.get(types_1.TYPES.IBarberUnavailabilityController);
const reviewController = inversify_1.container.get(types_1.TYPES.IReviewController);
userRoutes
    .post('/signup', userController.register)
    .post('/verify-otp', userController.verifyOTP)
    .post('/resend-otp', userController.resendOTP)
    .post("/login", userController.login)
    .post("/forgot-password", userController.forgotPassword)
    .post("/reset-password", userController.resetPassword)
    .post("/logout", userController.logout);
userRoutes
    .get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }))
    .get("/auth/google/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: "/login",
}), userController.googleCallback);
userRoutes
    .get('/get-barbers', userAuth, isBlocked_middleware_1.isBlockedMiddleware, userController.fetchAllBarbers)
    .get('/get-barber/:id', userAuth, isBlocked_middleware_1.isBlockedMiddleware, userController.fetchBarberDetailsById)
    .get('/get-barber-slots/:barberId', userAuth, isBlocked_middleware_1.isBlockedMiddleware, userController.fetchBarbersAndSlotRules)
    .get('/populated-slots/:id', userAuth, isBlocked_middleware_1.isBlockedMiddleware, slotController.getPopulatedSlots);
userRoutes
    .get('/bookings', userAuth, isBlocked_middleware_1.isBlockedMiddleware, bookingController.getBookingsByStatus)
    .post('/bookings/stage', userAuth, isBlocked_middleware_1.isBlockedMiddleware, bookingController.stageBooking)
    .put('/bookings/coupon', userAuth, isBlocked_middleware_1.isBlockedMiddleware, bookingController.couponApplication)
    .post('/bookings/confirm', userAuth, isBlocked_middleware_1.isBlockedMiddleware, bookingController.confirmBooking)
    .post('/bookings/verify-payment', userAuth, isBlocked_middleware_1.isBlockedMiddleware, bookingController.verifyPayment)
    .patch("/bookings/:id", userAuth, isBlocked_middleware_1.isBlockedMiddleware, bookingController.updateBookingStatus)
    .get("/bookings-by-id/:id", userAuth, isBlocked_middleware_1.isBlockedMiddleware, bookingController.getBookingById)
    .get("/bookings-by-barber/:id", userAuth, isBlocked_middleware_1.isBlockedMiddleware, bookingController.fetchBookingsOfBarber)
    .patch("/booking-check", userAuth, isBlocked_middleware_1.isBlockedMiddleware, bookingController.checkBeforePayment);
userRoutes
    .get("/favorites", userAuth, isBlocked_middleware_1.isBlockedMiddleware, favoritesController.getFavoritesByUser)
    .patch("/favorites", userAuth, isBlocked_middleware_1.isBlockedMiddleware, favoritesController.updateFavorites);
userRoutes
    .get("/service", userAuth, isBlocked_middleware_1.isBlockedMiddleware, serviceController.fetch)
    .get("/service/:id", userAuth, isBlocked_middleware_1.isBlockedMiddleware, serviceController.getServiceById);
userRoutes
    .get("/barber-unavailability/:id", userAuth, isBlocked_middleware_1.isBlockedMiddleware, barberUnavailabilityController.fetchBarberUnavailability);
userRoutes
    .get("/review/:id", userAuth, isBlocked_middleware_1.isBlockedMiddleware, reviewController.getReviewsByUser)
    .post("/review", userAuth, isBlocked_middleware_1.isBlockedMiddleware, reviewController.create)
    .delete("/review/:id", userAuth, isBlocked_middleware_1.isBlockedMiddleware, reviewController.delete);
userRoutes
    .get("/profile/:id", userAuth, userController.getUserProfileById)
    .put("/profile/:id", userAuth, userController.updateUserProfile)
    .patch("/profile/update-profile-picture/:id", (0, express_fileupload_1.default)(), userController.updateProfilePicture)
    .delete("/profile/delete-profile-picture/:id", userController.deleteProfilePicture);
exports.default = userRoutes;
