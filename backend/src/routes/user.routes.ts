import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import passport from '../config/passport'
import { FavoritesController } from "../controllers/favorites.controller";
import { FavoritesRepository } from "../repositories/favorites.repository";
import { FavoritesService } from "../services/favorites.service";
import { isBlockedMiddleware } from "../middlewares/isBlocked.middleware";
import { BookingRepository } from "../repositories/booking.repository";
import { BookingService } from "../services/booking.service";
import { BookingController } from "../controllers/booking.controller";

const userRoutes = Router()
const userAuth = authMiddleware(["user"])

const userRepo = new UserRepository()
const userService = new UserService(userRepo)
const userController = new UserController(userService)

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

userRoutes.get('/get-barbers', userAuth, isBlockedMiddleware, userController.fetchAllBarbers)
userRoutes.get('/get-barber-slots/:barberId', userAuth, isBlockedMiddleware, userController.fetchBarbersAndSlots)

const bookingRepo = new BookingRepository()
const bookingService = new BookingService(bookingRepo)
const bookingController = new BookingController(bookingService)

userRoutes
.post('/booking',bookingController.createBooking)
.patch("/booking/:id",bookingController.updateBookingStatus)

const favoritesRepo = new FavoritesRepository()
const favoritesService = new FavoritesService(favoritesRepo)
const favoritesController = new FavoritesController(favoritesService)

userRoutes
.get("/favorites",userAuth,isBlockedMiddleware,favoritesController.getFavoritesByUser)
.patch("/favorites",userAuth,isBlockedMiddleware,favoritesController.updateFavorites)



export default userRoutes;