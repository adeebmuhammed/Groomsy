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
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { SubscriptionService } from "../services/subscription.service";
import { SubscriptionController } from "../controllers/subscription.controller";

const barberRoutes = Router()
const barberAuth = authMiddleware(["barber"])
const multiAuth = authMiddleware(["user","barber"])

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

const subscriptionRepo = new SubscriptionRepository()
const subscriptionService = new SubscriptionService(subscriptionRepo)
const subscriptionController = new SubscriptionController(subscriptionService)

barberRoutes
.post('/signup',barberController.signup)
.post('/verify-otp',barberController.verifyOTP)
.post('/resend-otp',barberController.resendOTP)
.post('/login',barberController.login)
.post('/forgot-password',barberController.forgotPassword)
.post('/reset-password',barberController.resetPassword)
.post('/logout',barberController.logout)

barberRoutes
.get('/slots', barberAuth,slotController.getSlotRulesByBarber)
.post('/slots',barberAuth,slotController.createSlotRule)
.put('/slots/:id',barberAuth,slotController.updateSlotRule)
.delete('/slots/:id',barberAuth,slotController.deleteSlotRule)

barberRoutes
.get('/bookings',multiAuth,bookingController.fetchBookings)
.patch("/bookings/:id",barberAuth,bookingController.updateBookingStatus)

barberRoutes
.get("/unavailability/:id",barberAuth,barberUnavailabilityController.fetchBarberUnavailability)
.patch("/unavailability/weekly/:id",barberAuth,barberUnavailabilityController.editWeeklyDayOff)
.post("/unavailability/special/:id",barberAuth,barberUnavailabilityController.addOffDay)
.delete("/unavailability/special/:id",barberAuth,barberUnavailabilityController.removeOffDay)

barberRoutes
.post("/subscription",subscriptionController.manageSubscription)
.put("/subscription",subscriptionController.renewSubscription)
.post("verify-payment",subscriptionController.verifySubscriptionPayment)

export default barberRoutes;