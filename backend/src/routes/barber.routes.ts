import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { BarberController } from "../controllers/barber.controller";
import { BarberService } from "../services/barber.service";
import { BarberRepository } from "../repositories/barber.repository";
import { SlotRepository } from "../repositories/slot.repository";
import { SlotService } from "../services/slot.service";
import { SlotController } from "../controllers/slot.controller";
import { isBlockedMiddleware } from "../middlewares/isBlocked.middleware";

const barberRoutes = Router()
const barberAuth = authMiddleware(["barber"])

const barberRepo = new BarberRepository
const barberService = new BarberService(barberRepo)
const barberController = new BarberController(barberService)

const slotRepo = new SlotRepository()
const slotService = new SlotService(slotRepo)
const slotController = new SlotController(slotService)

barberRoutes
.post('/signup',barberController.signup)
.post('/verify-otp',barberController.verifyOTP)
.post('/resend-otp',barberController.resendOTP)
.post('/login',barberController.login)
.post('/forgot-password',barberController.forgotPassword)
.post('/reset-password',barberController.resetPassword)
.post('/logout',barberController.logout)

barberRoutes
.get('/slots',barberAuth, isBlockedMiddleware,slotController.getSlotsByBarber)
.post('/slots',barberAuth, isBlockedMiddleware,slotController.createSlot)
.put('/slots/:id',barberAuth, isBlockedMiddleware,slotController.updateSlot)
.delete('/slots/:id',barberAuth, isBlockedMiddleware,slotController.deleteSlot)

export default barberRoutes;