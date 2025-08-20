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
import { SubscriptionPlanController } from "../controllers/subscription.plan.controller";
import { SubscriptionPlanRepository } from "../repositories/subscription.plan.repository";
import { SubscriptionPlanService } from "../services/subscription.plan.service";
import { subscriptionMiddleware } from "../middlewares/subscription.middleware";

const barberRoutes = Router()
const barberAuth = authMiddleware(["barber"])
const multiAuth = authMiddleware(["user","barber"])
const subMiddleware = subscriptionMiddleware()

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

const planRepo = new SubscriptionPlanRepository()
const planService = new SubscriptionPlanService(planRepo)
const planController = new SubscriptionPlanController(planService)

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
.post('/slots',barberAuth,subMiddleware,slotController.createSlotRule)
.put('/slots/:id',barberAuth,subMiddleware,slotController.updateSlotRule)
.delete('/slots/:id',barberAuth,subMiddleware,slotController.deleteSlotRule)

barberRoutes
.get('/bookings',multiAuth,bookingController.fetchBookings)
.patch("/bookings/:id",barberAuth,subMiddleware,bookingController.updateBookingStatus)

barberRoutes
.get("/unavailability/:id",barberAuth,barberUnavailabilityController.fetchBarberUnavailability)
.patch("/unavailability/weekly/:id",barberAuth,subMiddleware,barberUnavailabilityController.editWeeklyDayOff)
.post("/unavailability/special/:id",barberAuth,subMiddleware,barberUnavailabilityController.addOffDay)
.delete("/unavailability/special/:id",barberAuth,subMiddleware,barberUnavailabilityController.removeOffDay)

barberRoutes
.get("/subscription/plans",planController.getPlansForBarber)
.get("/subscription/:id",barberAuth,subscriptionController.getSubscriptionDetailsByBarber)
.post("/subscription",barberAuth,subscriptionController.manageSubscription)
.put("/subscription",barberAuth,subscriptionController.renewSubscription)
.post("/subscription/verify-payment",barberAuth,subscriptionController.verifySubscriptionPayment)

export default barberRoutes;