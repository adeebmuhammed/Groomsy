import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { BarberController } from "../controllers/barber.controller";
import { BarberService } from "../services/barber.service";
import { BarberRepository } from "../repositories/barber.repository";
import passport from  '../config/passport'

const barberRoutes = Router()
const barberAuth = authMiddleware(["barber"])

const barberRepo = new BarberRepository
const barberService = new BarberService(barberRepo)
const barberController = new BarberController(barberService)

barberRoutes
.post('/signup',barberController.signup)
.post('/verify-otp',barberController.verifyOTP)
.post('/resend-otp',barberController.resendOTP)
.post('/login',barberController.login)
.post('/forgot-password',barberController.forgotPassword)
.post('/reset-password',barberController.resetPassword)

export default barberRoutes;