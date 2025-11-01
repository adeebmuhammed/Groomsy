// types.ts
const TYPES = {
  IUserController: Symbol.for("IUserController"),
  IUserService: Symbol.for("IUserService"),
  IUserRepository: Symbol.for("IUserRepository"),

  IBarberController: Symbol.for("IBarberController"),
  IBarberService: Symbol.for("IBarberService"),
  IBarberRepository: Symbol.for("IBarberRepository"),

  IAdminController: Symbol.for("IAdminController"),
  IAdminService: Symbol.for("IAdminService"),
  IAdminRepository: Symbol.for("IAdminRepository"),

  IBarberUnavailabilityController: Symbol.for("IBarberUnavailabilityController"),
  IBarberUnavailabilityService: Symbol.for("IBarberUnavailabilityService"),
  IBarberUnavailabilityRepository: Symbol.for("IBarberUnavailabilityRepository"),

  IBookingController: Symbol.for("IBookingController"),
  IBookingService: Symbol.for("IBookingService"),
  IBookingRepository: Symbol.for("IBookingRepository"),

  ICouponController: Symbol.for("ICouponController"),
  ICouponService: Symbol.for("ICouponService"),
  ICouponRepository: Symbol.for("ICouponRepository"),

  IFavoritesController: Symbol.for("IFavoritesController"),
  IFavoritesService: Symbol.for("IFavoritesService"),
  IFavoritesRepository: Symbol.for("IFavoritesRepository"),

  IOfferController: Symbol.for("IOfferController"),
  IOfferService: Symbol.for("IOfferService"),
  IOfferRepository: Symbol.for("IOfferRepository"),

  IReviewController: Symbol.for("IReviewController"),
  IReviewService: Symbol.for("IReviewService"),
  IReviewRepository: Symbol.for("IReviewRepository"),

  IServiceController: Symbol.for("IServiceController"),
  IServiceService: Symbol.for("IServiceService"),
  IServiceRepository: Symbol.for("IServiceRepository"),

  ISlotController: Symbol.for("ISlotController"),
  ISlotService: Symbol.for("ISlotService"),
  ISlotRepository: Symbol.for("ISlotRepository"),

  ISubscriptionController: Symbol.for("ISubscriptionController"),
  ISubscriptionService: Symbol.for("ISubscriptionService"),
  ISubscriptionRepository: Symbol.for("ISubscriptionRepository"),

  ISubscriptionPlanController: Symbol.for("ISubscriptionPlanController"),
  ISubscriptionPlanService: Symbol.for("ISubscriptionPlanService"),
  ISubscriptionPlanRepository: Symbol.for("ISubscriptionPlanRepository"),

  IOtpRepository: Symbol.for("IOtpRepository"),
};

export { TYPES };
