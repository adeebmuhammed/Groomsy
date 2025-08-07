import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { BarberController } from "../controllers/barber.controller";
import { BarberService } from "../services/barber.service";
import { BarberRepository } from "../repositories/barber.repository";
import { SlotRepository } from "../repositories/slot.repository";
import { SlotService } from "../services/slot.service";
import { SlotController } from "../controllers/slot.controller";
import { isBlockedMiddleware } from "../middlewares/isBlocked.middleware";
import { BookingRepository } from "../repositories/booking.repository";
import { BookingService } from "../services/booking.service";
import { BookingController } from "../controllers/booking.controller";
import { BarberUnavailabilityRepository } from "../repositories/barber.unavailability.repository";
import { BarberUnavailabilityService } from "../services/barber.unavailability.service";
import { BarberUnavailabilityController } from "../controllers/barber.unavailability.controller";

const barberRoutes = Router()
const barberAuth = authMiddleware(["barber"])

const barberRepo = new BarberRepository
const barberService = new BarberService(barberRepo)
const barberController = new BarberController(barberService)

const slotRepo = new SlotRepository()
const slotService = new SlotService(slotRepo)
const slotController = new SlotController(slotService)

const bookingRepo = new BookingRepository()
const bookingService = new BookingService(bookingRepo)
const bookingController = new BookingController(bookingService)

const barberUnavailabilityRepo = new BarberUnavailabilityRepository
const barberUnavailabilityService = new BarberUnavailabilityService(barberUnavailabilityRepo)
const barberUnavailabilityController = new BarberUnavailabilityController(barberUnavailabilityService)

barberRoutes
.post('/signup',barberController.signup)
.post('/verify-otp',barberController.verifyOTP)
.post('/resend-otp',barberController.resendOTP)
.post('/login',barberController.login)
.post('/forgot-password',barberController.forgotPassword)
.post('/reset-password',barberController.resetPassword)
.post('/logout',barberController.logout)

barberRoutes
.get('/slots',slotController.getSlotRulesByBarber)
.post('/slots',slotController.createSlotRule)
.put('/slots/:id',slotController.updateSlotRule)
.delete('/slots/:id',slotController.deleteSlotRule)

barberRoutes
.get('/bookings',bookingController.fetchBookings)
.patch("/bookings/:id",bookingController.updateBookingStatus)

barberRoutes
.patch("/unavailability/weekly/:id",barberUnavailabilityController.editWeeklyDayOff)

export default barberRoutes;