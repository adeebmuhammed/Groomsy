import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { subscriptionMiddleware } from "../middlewares/subscription.middleware";
import { container } from "../config/inversify";
import { TYPES } from "../config/types";
import { IBarberController } from "../controllers/interfaces/IBarberController";
import { ISlotController } from "../controllers/interfaces/ISlotController";
import { IBookingController } from "../controllers/interfaces/IBookingController";
import { IBarberUnavailabilityController } from "../controllers/interfaces/IBarberUnavailabilityController";
import { ISubscriptionController } from "../controllers/interfaces/ISubscriptionController";
import { ISubscriptionPlanController } from "../controllers/interfaces/ISubscriptionPlanController";
import { IServiceController } from "../controllers/interfaces/IServiceController";
import fileUpload from "express-fileupload";
import { ROLES } from "../utils/constants";

const barberRoutes = Router()
const barberAuth = authMiddleware([ROLES.BARBER])
const multiAuth = authMiddleware([ROLES.USER,ROLES.BARBER])

const barberController = container.get<IBarberController>(TYPES.IBarberController)
const slotController = container.get<ISlotController>(TYPES.ISlotController)
const bookingController = container.get<IBookingController>(TYPES.IBookingController)
const barberUnavailabilityController = container.get<IBarberUnavailabilityController>(TYPES.IBarberUnavailabilityController)
const subscriptionController = container.get<ISubscriptionController>(TYPES.ISubscriptionController)
const planController = container.get<ISubscriptionPlanController>(TYPES.ISubscriptionPlanController)
const serviceController = container.get<IServiceController>(TYPES.IServiceController)

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
.get("/subscription/plan/:id",planController.getPlanById)
.get("/subscription/:id",barberAuth,subscriptionController.getSubscriptionDetailsByBarber)
.post("/subscription",barberAuth,subscriptionController.manageSubscription)
.put("/subscription",barberAuth,subscriptionController.renewSubscription)
.post("/subscription/verify-payment",barberAuth,subscriptionController.verifySubscriptionPayment)

barberRoutes
.get("/profile/:id", barberAuth,barberController.getBarberProfileById)
.patch("/profile/address/:id", barberAuth,barberController.updateBarberAddress)
.put("/profile/:id", barberAuth,barberController.updateBarberProfile)
.patch("/profile/update-profile-picture/:id",fileUpload(),barberController.updateProfilePicture)
.delete("/profile/delete-profile-picture/:id",barberController.deleteProfilePicture)

barberRoutes
.get("/users",barberAuth,barberController.fetchUsers)

barberRoutes
.get("/service/:id",barberAuth,serviceController.getServiceById)

barberRoutes
.get('/bookings', barberAuth,bookingController.getBookingsByStatus)

barberRoutes
.get("/dashboard-stats/:id",barberController.getBarberDashboardStats)

export default barberRoutes;