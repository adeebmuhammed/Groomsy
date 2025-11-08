"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../utils/constants");
const booking_mapper_1 = require("../mappers/booking.mapper");
const razorpay_1 = __importDefault(require("../utils/razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let BookingService = class BookingService {
    constructor(_bookingRepo, _userRepo, _barberRepo, _serviceRepo, _barberUnavailabilityRepo, _couponRepo, _offerRepo) {
        this._bookingRepo = _bookingRepo;
        this._userRepo = _userRepo;
        this._barberRepo = _barberRepo;
        this._serviceRepo = _serviceRepo;
        this._barberUnavailabilityRepo = _barberUnavailabilityRepo;
        this._couponRepo = _couponRepo;
        this._offerRepo = _offerRepo;
        this.fetchBookings = async (role, id, page = 1, limit = 5) => {
            const skip = (page - 1) * limit;
            const filter = {};
            if (role === constants_1.ROLES.USER) {
                if (!id)
                    throw new Error("User ID is required");
                filter.user = id;
            }
            else if (role === constants_1.ROLES.BARBER) {
                if (!id)
                    throw new Error("Barber ID is required");
                filter.barber = id;
            }
            else if (role !== constants_1.ROLES.ADMIN) {
                throw new Error("Invalid role");
            }
            const { bookings, totalCount } = await this._bookingRepo.findWithPaginationAndCount(filter, skip, limit, {});
            const bookingDTOs = booking_mapper_1.BookingMapper.toBookingResponseArray(bookings);
            return {
                response: { data: bookingDTOs, totalCount },
            };
        };
        this.stageBooking = async (userId, data) => {
            const user = await this._userRepo.findById(userId);
            if (!user)
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            const barber = await this._barberRepo.findById(data.barberId);
            if (!barber)
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            const unavailability = await this._barberUnavailabilityRepo.findOne({
                barber: data.barberId,
            });
            if (!unavailability)
                throw new Error("barber unavailability not found");
            const service = await this._serviceRepo.findById(data.serviceId);
            if (!service)
                throw new Error("service not found");
            const bookingDate = new Date(data.startTime);
            const bookingDayName = bookingDate.toLocaleDateString("en-US", {
                weekday: "long",
            });
            if (bookingDayName === unavailability.weeklyOff) {
                throw new Error(`Cannot book on ${bookingDayName}, barber is unavailable (weekly off)`);
            }
            const bookingDateStr = bookingDate.toISOString().split("T")[0];
            const isSpecialOff = unavailability.specialOffDays.some((offDay) => offDay.date === bookingDateStr);
            if (isSpecialOff) {
                throw new Error(`Cannot book on ${bookingDateStr}, barber has a special off`);
            }
            const activeStaged = await this._bookingRepo.find({
                user: userId,
                status: "staged",
            });
            if (activeStaged.length >= 2) {
                throw new Error("You already have the maximum allowed active holds");
            }
            const similarBooking = await this._bookingRepo.findSimilarBooking(data);
            if (similarBooking)
                throw new Error("slot is already booked");
            const today = new Date();
            const offer = await this._offerRepo.findOne({
                startDate: { $lte: today },
                endDate: { $gte: today },
            });
            let finalPrice = data.price;
            let discountAmount;
            if (offer) {
                discountAmount = (data.price * offer.discount) / 100;
                finalPrice = data.price - discountAmount;
            }
            const end = new Date(data.endTime);
            const start = new Date(data.startTime);
            if (end.getTime() <= today.getTime()) {
                throw new Error("Cannot create booking for an expired slot");
            }
            if (start.getTime() <= today.getTime()) {
                throw new Error("Cannot create booking starting in the past");
            }
            const createBooking = {
                user: new mongoose_1.default.Types.ObjectId(userId),
                barber: new mongoose_1.default.Types.ObjectId(data.barberId),
                service: new mongoose_1.default.Types.ObjectId(data.serviceId),
                totalPrice: data.price,
                finalPrice,
                discountAmount,
                slotDetails: {
                    date: data.date,
                    startTime: data.startTime,
                    endTime: data.endTime,
                },
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            };
            const booking = await this._bookingRepo.create(createBooking);
            if (!booking) {
                throw new Error("staging booking failed");
            }
            const response = booking_mapper_1.BookingMapper.toBookingResponse(booking);
            return {
                response,
            };
        };
        this.checkBeforePayment = async (bookingId) => {
            const booking = await this._bookingRepo.findById(bookingId);
            if (!booking) {
                throw new Error("booking not found");
            }
            let updated;
            if (booking.status === constants_1.BOOKINGSTATUS.STAGED) {
                updated = await this._bookingRepo.deleteBooking(bookingId);
            }
            if (!updated) {
                throw new Error("booking deletion failed");
            }
            return {
                checkResponse: { message: "booking deleted successfully" },
            };
        };
        this.couponApplication = async (bookingId, couponCode) => {
            const booking = await this._bookingRepo.findById(bookingId);
            if (!booking) {
                throw new Error("booking not found");
            }
            const coupon = await this._couponRepo.findOne({ code: couponCode });
            if (!coupon) {
                throw new Error("invalid coupon code");
            }
            let finalPrice;
            if (booking.totalPrice >= coupon.limitAmount) {
                if (coupon.maxCount > coupon.usedCount) {
                    finalPrice = booking.totalPrice - coupon.couponAmount;
                }
                else {
                    throw new Error("coupon used count exceeded");
                }
            }
            else {
                throw new Error("total price must be greater than or equal to coupon limit amount");
            }
            const updatedBooking = await this._bookingRepo.update(bookingId, {
                finalPrice,
                couponCode,
                discountAmount: booking.totalPrice - finalPrice,
            });
            if (!updatedBooking) {
                throw new Error("coupon application failed");
            }
            const response = booking_mapper_1.BookingMapper.toBookingResponse(updatedBooking);
            return {
                response,
            };
        };
        this.confirmBooking = async (bookingId, userId, data) => {
            const booking = await this._bookingRepo.findById(bookingId);
            if (!booking)
                throw new Error("Booking not found");
            if (booking.user.toString() !== userId)
                throw new Error("Unauthorized");
            if (booking.status !== "staged")
                throw new Error("Booking is not in staged state");
            booking.finalPrice =
                data.finalPrice !== undefined
                    ? data.finalPrice
                    : booking.finalPrice ?? booking.totalPrice;
            booking.discountAmount =
                data.discountAmount !== undefined
                    ? data.discountAmount
                    : booking.discountAmount;
            booking.couponCode = data.couponCode ?? booking.couponCode;
            const razorpayOrder = await razorpay_1.default.orders.create({
                amount: Math.round(booking.finalPrice * 100),
                currency: "INR",
                receipt: bookingId,
            });
            booking.razorpayOrderId = razorpayOrder.id;
            const updated = await this._bookingRepo.update(booking._id, booking);
            if (!updated) {
                throw new Error("booking confirmation failed");
            }
            return {
                response: {
                    message: "Razorpay order created successfully",
                    orderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    bookingId: booking._id,
                    keyId: process.env.RAZORPAY_KEY_ID,
                },
            };
        };
        this.verifyPayment = async (razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId) => {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto_1.default
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");
            if (expectedSignature === razorpay_signature) {
                const booking = await this._bookingRepo.findById(bookingId);
                if (!booking)
                    throw new Error("Booking not found");
                const updated = await this._bookingRepo.updateAfterVerfyPayment(booking._id);
                if (!updated) {
                    throw new Error("payment verfication failed");
                }
            }
            else {
                throw new Error("Invalid payment signature");
            }
            return {
                response: { message: "payment verified successfully" },
            };
        };
        this.updateBookingStatus = async (role, bookingId, bookingStatus) => {
            if (role !== constants_1.ROLES.USER && role !== constants_1.ROLES.BARBER) {
                throw new Error("invalid role");
            }
            const booking = await this._bookingRepo.findById(bookingId);
            if (!booking) {
                throw new Error("booking not found");
            }
            if (booking.status === constants_1.BOOKINGSTATUS.FINISHED) {
                throw new Error("the booking appointment is already finished");
            }
            if (booking.status === bookingStatus) {
                throw new Error(`booking status is already ${bookingStatus}`);
            }
            if (role === constants_1.ROLES.USER) {
                if (booking.status === constants_1.BOOKINGSTATUS.PENDING &&
                    bookingStatus === "cancel") {
                    booking.status = constants_1.BOOKINGSTATUS.CANCELLED_BY_USER;
                }
                else {
                    throw new Error("Invalid status transition for user");
                }
            }
            else if (role === constants_1.ROLES.BARBER) {
                if (booking.status === constants_1.BOOKINGSTATUS.PENDING &&
                    bookingStatus === "cancel") {
                    booking.status = constants_1.BOOKINGSTATUS.CANCELLED_BY_BARBER;
                }
                else if (booking.status === constants_1.BOOKINGSTATUS.PENDING &&
                    bookingStatus === constants_1.BOOKINGSTATUS.FINISHED) {
                    booking.status = constants_1.BOOKINGSTATUS.FINISHED;
                }
                else {
                    throw new Error("Invalid status transition for barber");
                }
            }
            const updatedBooking = await this._bookingRepo.update(booking.id.toString(), booking);
            if (!updatedBooking) {
                throw new Error("status updation failed");
            }
            return {
                response: { message: "booking status updated successfully" },
            };
        };
        this.getBookingById = async (bookingId) => {
            const booking = await this._bookingRepo.findById(bookingId);
            if (!booking) {
                throw new Error("booking not found");
            }
            return {
                response: booking_mapper_1.BookingMapper.toBookingResponse(booking),
            };
        };
        this.getBookingsByStatus = async (status, userId, filter, page, limit, role) => {
            const allowedStatuses = [
                constants_1.BOOKINGSTATUS.STAGED,
                constants_1.BOOKINGSTATUS.PENDING,
                constants_1.BOOKINGSTATUS.CANCELLED,
                constants_1.BOOKINGSTATUS.FINISHED,
            ];
            if (!allowedStatuses.includes(status)) {
                throw new Error("invalid booking status");
            }
            const skip = (page - 1) * limit;
            let filterQuery = {};
            if (role === constants_1.ROLES.USER && userId) {
                const user = await this._userRepo.findById(userId);
                if (!user)
                    throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
                filterQuery.user = userId;
            }
            else if (role === constants_1.ROLES.BARBER && userId) {
                const barber = await this._barberRepo.findById(userId);
                if (!barber)
                    throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
                filterQuery.barber = userId;
            }
            else if (role === constants_1.ROLES.ADMIN) {
                filterQuery = {};
            }
            let filterParam = {};
            if (filter === constants_1.TABLEFILTERS.NEWEST) {
                filterParam.createdAt = -1;
            }
            else if (filter === constants_1.TABLEFILTERS.OLDEST) {
                filterParam.createdAt = 1;
            }
            else if (filter === constants_1.TABLEFILTERS.PRICE_LOW) {
                filterParam.totalPrice = 1;
            }
            else if (filter === constants_1.TABLEFILTERS.PRICE_HIGH) {
                filterParam.totalPrice = -1;
            }
            filterQuery.status =
                status === constants_1.BOOKINGSTATUS.CANCELLED
                    ? {
                        $in: [
                            constants_1.BOOKINGSTATUS.CANCELLED_BY_USER,
                            constants_1.BOOKINGSTATUS.CANCELLED_BY_BARBER,
                        ],
                    }
                    : status;
            const { bookings, totalCount } = await this._bookingRepo.findWithPaginationAndCount(filterQuery, skip, limit, filterParam);
            return {
                response: {
                    data: booking_mapper_1.BookingMapper.toBookingResponseArray(bookings),
                    totalCount,
                },
            };
        };
        this.fetchBookingsOfBarber = async (barberId) => {
            const barber = await this._barberRepo.findById(barberId);
            if (!barber) {
                throw new Error(constants_1.MESSAGES.ERROR.BARBER_NOT_FOUND);
            }
            const filter = { barber: barberId };
            const { bookings, totalCount } = await this._bookingRepo.findWithPaginationAndCount(filter, 0, 100, {});
            const bookingDTOs = booking_mapper_1.BookingMapper.toBookingResponseArray(bookings);
            return {
                bookingsOfBarber: { data: bookingDTOs, totalCount },
            };
        };
    }
};
exports.BookingService = BookingService;
exports.BookingService = BookingService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBarberRepository)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.IServiceRepository)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.IBarberUnavailabilityRepository)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.ICouponRepository)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.IOfferRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], BookingService);
