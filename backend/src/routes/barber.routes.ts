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
import { container } from "../config/inversify";
import { TYPES } from "../config/types";
import { IBarberController } from "../controllers/interfaces/IBarberController";
import { ISlotController } from "../controllers/interfaces/ISlotController";
import { IBookingController } from "../controllers/interfaces/IBookingController";
import { IBarberUnavailabilityController } from "../controllers/interfaces/IBarberUnavailabilityController";
import { ISubscriptionController } from "../controllers/interfaces/ISubscriptionController";
import { ISubscriptionPlanController } from "../controllers/interfaces/ISubscriptionPlanController";

const barberRoutes = Router()
const barberAuth = authMiddleware(["barber"])
const multiAuth = authMiddleware(["user","barber"])

const barberController = container.get<IBarberController>(TYPES.IBarberController)
const slotController = container.get<ISlotController>(TYPES.ISlotController)
const bookingController = container.get<IBookingController>(TYPES.IBookingController)
const barberUnavailabilityController = container.get<IBarberUnavailabilityController>(TYPES.IBarberUnavailabilityController)
const subscriptionController = container.get<ISubscriptionController>(TYPES.ISubscriptionController)
const planController = container.get<ISubscriptionPlanController>(TYPES.ISubscriptionPlanController)

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
.post('/slots',barberAuth,subscriptionMiddleware("Slots"),slotController.createSlotRule)
.put('/slots/:id',barberAuth,subscriptionMiddleware("Slots"),slotController.updateSlotRule)
.delete('/slots/:id',barberAuth,subscriptionMiddleware("Slots"),slotController.deleteSlotRule)

barberRoutes
.get('/bookings',multiAuth,bookingController.fetchBookings)
.patch("/bookings/:id",barberAuth,subscriptionMiddleware("Bookings"),bookingController.updateBookingStatus)

barberRoutes
.get("/barber-unavailability/:id",barberAuth,barberUnavailabilityController.fetchBarberUnavailability)
.patch("/barber-unavailability/weekly/:id",barberAuth,subscriptionMiddleware("Unavailability"),barberUnavailabilityController.editWeeklyDayOff)
.post("/barber-unavailability/special/:id",barberAuth,subscriptionMiddleware("Unavailability"),barberUnavailabilityController.addOffDay)
.delete("/barber-unavailability/special/:id",barberAuth,subscriptionMiddleware("Unavailability"),barberUnavailabilityController.removeOffDay)

barberRoutes
.get("/subscription/plans",planController.getPlansForBarber)
.get("/subscription/:id",barberAuth,subscriptionController.getSubscriptionDetailsByBarber)
.post("/subscription",barberAuth,subscriptionController.manageSubscription)
.put("/subscription",barberAuth,subscriptionController.renewSubscription)
.post("/subscription/verify-payment",barberAuth,subscriptionController.verifySubscriptionPayment)

export default barberRoutes;