import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import passport from '../config/passport'

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

export default userRoutes;