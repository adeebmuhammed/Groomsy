import { Container } from "inversify";
import { TYPES } from "./types";

import { IUserController } from "../controllers/interfaces/IUserController";
import { UserController } from "../controllers/user.controller";

import { IUserService } from "../services/interfaces/IUserService";
import { UserService } from "../services/user.service";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { IBarberController } from "../controllers/interfaces/IBarberController";
import { BarberController } from "../controllers/barber.controller";
import { IBarberService } from "../services/interfaces/IBarberService";
import { BarberService } from "../services/barber.service";
import { IBarberRepository } from "../repositories/interfaces/IBarberRepository";
import { BarberRepository } from "../repositories/barber.repository";
import { IAdminController } from "../controllers/interfaces/IAdminController";
import { AdminController } from "../controllers/admin.controller";
import { IAdminService } from "../services/interfaces/IAdminService";
import { AdminService } from "../services/admin.service";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { AdminRepository } from "../repositories/admin.repository";
import { IBarberUnavailabilityController } from "../controllers/interfaces/IBarberUnavailabilityController";
import { BarberUnavailabilityController } from "../controllers/barber.unavailability.controller";
import { IBarberUnavailabilityService } from "../services/interfaces/IBarberUnavailabilityService";
import { BarberUnavailabilityService } from "../services/barber.unavailability.service";
import { IBarberUnavailabilityRepository } from "../repositories/interfaces/IBarberUnavailabilityRepository";
import { BarberUnavailabilityRepository } from "../repositories/barber.unavailability.repository";
import { ICouponController } from "../controllers/interfaces/ICouponController";
import { CouponController } from "../controllers/coupon.controller";
import { ICouponService } from "../services/interfaces/ICouponService";
import { CouponService } from "../services/coupon.service";
import { ICouponRepository } from "../repositories/interfaces/ICouponRepository";
import { CouponResitory } from "../repositories/coupon.repository";
import { IFavoritesController } from "../controllers/interfaces/IFavoritesController";
import { FavoritesController } from "../controllers/favorites.controller";
import { IFavoritesService } from "../services/interfaces/IFavoritesService";
import { FavoritesService } from "../services/favorites.service";
import { IFavoritesRepository } from "../repositories/interfaces/IFavoritesRepository";
import { FavoritesRepository } from "../repositories/favorites.repository";
import { IOfferController } from "../controllers/interfaces/IOfferController";
import { OfferController } from "../controllers/offer.controller";
import { IOfferService } from "../services/interfaces/IOfferService";
import { OfferService } from "../services/offer.service";
import { IOfferRepository } from "../repositories/interfaces/IOfferRepository";
import { OfferRepository } from "../repositories/offer.repository";
import { IReviewController } from "../controllers/interfaces/IReviewController";
import { ReviewController } from "../controllers/review.controller";
import { IReviewService } from "../services/interfaces/IReviewService";
import { ReviewService } from "../services/review.service";
import { IReviewRepository } from "../repositories/interfaces/IReviewRepository";
import { ReviewRepository } from "../repositories/review.repository";
import { IServiceController } from "../controllers/interfaces/IServiceController";
import { ServiceController } from "../controllers/service.controller";
import { IServiceService } from "../services/interfaces/IServiceService";
import { ServiceService } from "../services/service.service";
import { IServiceRepository } from "../repositories/interfaces/IServiceRepository";
import { ServiceRepository } from "../repositories/service.repository";
import { ISlotController } from "../controllers/interfaces/ISlotController";
import { SlotController } from "../controllers/slot.controller";
import { ISlotService } from "../services/interfaces/ISlotService";
import { SlotService } from "../services/slot.service";
import { ISlotRepository } from "../repositories/interfaces/ISlotRepository";
import { SlotRepository } from "../repositories/slot.repository";
import { ISubscriptionController } from "../controllers/interfaces/ISubscriptionController";
import { SubscriptionController } from "../controllers/subscription.controller";
import { ISubscriptionService } from "../services/interfaces/ISubscriptionService";
import { SubscriptionService } from "../services/subscription.service";
import { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository";
import { SubscriptionRepository } from "../repositories/subscription.repository";
import { ISubscriptionPlanController } from "../controllers/interfaces/ISubscriptionPlanController";
import { SubscriptionPlanController } from "../controllers/subscription.plan.controller";
import { ISubscriptionPlanService } from "../services/interfaces/ISubscriptionPlanService";
import { SubscriptionPlanService } from "../services/subscription.plan.service";
import { SubscriptionPlanRepository } from "../repositories/subscription.plan.repository";
import { ISubscriptionPlanRepository } from "../repositories/interfaces/ISubsciptionPlanRepository";
import { IBookingController } from "../controllers/interfaces/IBookingController";
import { BookingController } from "../controllers/booking.controller";
import { IBookingService } from "../services/interfaces/IBookingService";
import { BookingService } from "../services/booking.service";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { BookingRepository } from "../repositories/booking.repository";

const container = new Container();

container.bind<IUserController>(TYPES.IUserController).to(UserController);
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);

container.bind<IBarberController>(TYPES.IBarberController).to(BarberController);
container.bind<IBarberService>(TYPES.IBarberService).to(BarberService);
container.bind<IBarberRepository>(TYPES.IBarberRepository).to(BarberRepository);

container.bind<IAdminController>(TYPES.IAdminController).to(AdminController);
container.bind<IAdminService>(TYPES.IAdminService).to(AdminService);
container.bind<IAdminRepository>(TYPES.IAdminRepository).to(AdminRepository);

container.bind<IBarberUnavailabilityController>(TYPES.IBarberUnavailabilityController).to(BarberUnavailabilityController);
container.bind<IBarberUnavailabilityService>(TYPES.IBarberUnavailabilityService).to(BarberUnavailabilityService);
container.bind<IBarberUnavailabilityRepository>(TYPES.IBarberUnavailabilityRepository).to(BarberUnavailabilityRepository);

container.bind<IBookingController>(TYPES.IBookingController).to(BookingController);
container.bind<IBookingService>(TYPES.IBookingService).to(BookingService);
container.bind<IBookingRepository>(TYPES.IBookingRepository).to(BookingRepository);

container.bind<ICouponController>(TYPES.ICouponController).to(CouponController);
container.bind<ICouponService>(TYPES.ICouponService).to(CouponService);
container.bind<ICouponRepository>(TYPES.ICouponRepository).to(CouponResitory);

container.bind<IFavoritesController>(TYPES.IFavoritesController).to(FavoritesController);
container.bind<IFavoritesService>(TYPES.IFavoritesService).to(FavoritesService);
container.bind<IFavoritesRepository>(TYPES.IFavoritesRepository).to(FavoritesRepository);

container.bind<IOfferController>(TYPES.IOfferController).to(OfferController);
container.bind<IOfferService>(TYPES.IOfferService).to(OfferService);
container.bind<IOfferRepository>(TYPES.IOfferRepository).to(OfferRepository);

container.bind<IReviewController>(TYPES.IReviewController).to(ReviewController);
container.bind<IReviewService>(TYPES.IReviewService).to(ReviewService);
container.bind<IReviewRepository>(TYPES.IReviewRepository).to(ReviewRepository);

container.bind<IServiceController>(TYPES.IServiceController).to(ServiceController);
container.bind<IServiceService>(TYPES.IServiceService).to(ServiceService);
container.bind<IServiceRepository>(TYPES.IServiceRepository).to(ServiceRepository);

container.bind<ISlotController>(TYPES.ISlotController).to(SlotController);
container.bind<ISlotService>(TYPES.ISlotService).to(SlotService);
container.bind<ISlotRepository>(TYPES.ISlotRepository).to(SlotRepository);

container.bind<ISubscriptionController>(TYPES.ISubscriptionController).to(SubscriptionController);
container.bind<ISubscriptionService>(TYPES.ISubscriptionService).to(SubscriptionService);
container.bind<ISubscriptionRepository>(TYPES.ISubscriptionRepository).to(SubscriptionRepository);

container.bind<ISubscriptionPlanController>(TYPES.ISubscriptionPlanController).to(SubscriptionPlanController);
container.bind<ISubscriptionPlanService>(TYPES.ISubscriptionPlanService).to(SubscriptionPlanService);
container.bind<ISubscriptionPlanRepository>(TYPES.ISubscriptionPlanRepository).to(SubscriptionPlanRepository);

export { container };
