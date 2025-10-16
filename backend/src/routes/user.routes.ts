import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import passport from '../config/passport'
import { isBlockedMiddleware } from "../middlewares/isBlocked.middleware";
import { container } from "../config/inversify";
import { TYPES } from "../config/types";
import { IUserController } from "../controllers/interfaces/IUserController";
import { IBookingController } from "../controllers/interfaces/IBookingController";
import { IFavoritesController } from "../controllers/interfaces/IFavoritesController";
import { ISlotController } from "../controllers/interfaces/ISlotController";
import { IServiceController } from "../controllers/interfaces/IServiceController";
import { IBarberUnavailabilityController } from "../controllers/interfaces/IBarberUnavailabilityController";
import { IReviewController } from "../controllers/interfaces/IReviewController";
import fileUpload from "express-fileupload";

const userRoutes = Router()
const userAuth = authMiddleware(["user"])

const userController = container.get<IUserController>(TYPES.IUserController)
const bookingController = container.get<IBookingController>(TYPES.IBookingController)
const favoritesController = container.get<IFavoritesController>(TYPES.IFavoritesController)
const slotController = container.get<ISlotController>(TYPES.ISlotController)
const serviceController = container.get<IServiceController>(TYPES.IServiceController)
const barberUnavailabilityController = container.get<IBarberUnavailabilityController>(TYPES.IBarberUnavailabilityController)
const reviewController = container.get<IReviewController>(TYPES.IReviewController)

userRoutes
.post('/signup',userController.register)
.post('/verify-otp',userController.verifyOTP)
.post('/resend-otp',userController.resendOTP)
.post("/login",userController.login)
.post("/forgot-password",userController.forgotPassword)
.post("/reset-password",userController.resetPassword)
.post("/logout", userController.logout)

userRoutes
.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)
.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    userController.googleCallback
);

userRoutes
.get('/get-barbers', userAuth, isBlockedMiddleware, userController.fetchAllBarbers)
.get('/get-barber/:id', userAuth, isBlockedMiddleware, userController.fetchBarberDetailsById)
.get('/get-barber-slots/:barberId', userAuth, isBlockedMiddleware, userController.fetchBarbersAndSlotRules)
.get('/populated-slots/:id',userAuth, isBlockedMiddleware,slotController.getPopulatedSlots)

userRoutes
.get('/bookings', userAuth, isBlockedMiddleware,bookingController.getBookingsByStatus)
.post('/bookings/stage',userAuth,isBlockedMiddleware,bookingController.stageBooking)
.put('/bookings/coupon',userAuth,isBlockedMiddleware,bookingController.couponApplication)
.post('/bookings/confirm',userAuth,isBlockedMiddleware,bookingController.confirmBooking)
.post('/bookings/verify-payment',userAuth,isBlockedMiddleware,bookingController.verifyPayment)
.patch("/bookings/:id", userAuth, isBlockedMiddleware,bookingController.updateBookingStatus)
.get("/bookings-by-id/:id", userAuth, isBlockedMiddleware,bookingController.getBookingById)

userRoutes
.get("/favorites",userAuth,isBlockedMiddleware,favoritesController.getFavoritesByUser)
.patch("/favorites",userAuth,isBlockedMiddleware,favoritesController.updateFavorites)

userRoutes
.get("/service", userAuth,isBlockedMiddleware,serviceController.fetch)
.get("/service/:id",userAuth,isBlockedMiddleware,serviceController.getServiceById)

userRoutes
.get("/barber-unavailability/:id",userAuth,isBlockedMiddleware,barberUnavailabilityController.fetchBarberUnavailability)

userRoutes
.get("/review/:id",userAuth,isBlockedMiddleware,reviewController.getReviewsByUser)
.post("/review",userAuth,isBlockedMiddleware,reviewController.create)
.delete("/review/:id",userAuth,isBlockedMiddleware,reviewController.delete)

userRoutes
.get("/profile/:id",userAuth,userController.getUserProfileById)
.put("/profile/:id",userAuth,userController.updateUserProfile)
.patch("/profile/update-profile-picture/:id",fileUpload(),userController.updateProfilePicture)
.delete("/profile/delete-profile-picture/:id",userController.deleteProfilePicture)

export default userRoutes;