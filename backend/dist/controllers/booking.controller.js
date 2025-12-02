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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const constants_1 = require("../utils/constants");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let BookingController = class BookingController {
    constructor(_bookingService) {
        this._bookingService = _bookingService;
        this.fetchBookings = async (req, res) => {
            try {
                const role = req.query.role;
                const id = req.query.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const { response } = await this._bookingService.fetchBookings(role, id, page, limit);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to fetch bookings",
                });
            }
        };
        this.stageBooking = async (req, res) => {
            try {
                const userId = req.query.userId;
                const data = req.body;
                const { response } = await this._bookingService.stageBooking(userId, data);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to stage booking",
                });
            }
        };
        this.checkBeforePayment = async (req, res) => {
            try {
                const bookingId = req.body["bookingId"];
                const { checkResponse } = await this._bookingService.checkBeforePayment(bookingId);
                let status;
                if (checkResponse) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(checkResponse);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to check booking before payment",
                });
            }
        };
        this.confirmBooking = async (req, res) => {
            try {
                const userId = req.query.userId;
                const bookingId = req.query.bookingId;
                const data = req.body;
                const { response } = await this._bookingService.confirmBooking(bookingId, userId, data);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to confirm booking",
                });
            }
        };
        this.couponApplication = async (req, res) => {
            try {
                const bookingId = req.query.bookingId;
                const couponCode = req.body.couponCode;
                const { response } = await this._bookingService.couponApplication(bookingId, couponCode);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to apply coupon",
                });
            }
        };
        this.verifyPayment = async (req, res) => {
            try {
                const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId, } = req.body;
                const { response } = await this._bookingService.verifyPayment(razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingId);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to verify payment",
                });
            }
        };
        this.updateBookingStatus = async (req, res) => {
            try {
                const role = req.query.role;
                const bookingId = req.params.bookingId;
                const { bookingStatus } = req.body;
                const { response } = await this._bookingService.updateBookingStatus(role, bookingId, bookingStatus);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to update booking status",
                });
            }
        };
        this.getBookingById = async (req, res) => {
            try {
                const bookingId = req.params["bookingId"];
                const { response } = await this._bookingService.getBookingById(bookingId);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to fetch booking by id",
                });
            }
        };
        this.getBookingsByStatus = async (req, res) => {
            try {
                const role = req.query.role;
                const userId = req.query["id"];
                const bookingStatus = req.query.status;
                const filter = req.query.filter;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const { response } = await this._bookingService.getBookingsByStatus(bookingStatus, userId || null, filter, page, limit, role);
                const status = response ? constants_1.STATUS_CODES.OK : constants_1.STATUS_CODES.CONFLICT;
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error
                        ? error.message
                        : "Failed to fetch bookings by status",
                });
            }
        };
        this.fetchBookingsOfBarber = async (req, res) => {
            try {
                const barberId = req.params["barberId"];
                const { bookingsOfBarber } = await this._bookingService.fetchBookingsOfBarber(barberId);
                let status;
                if (bookingsOfBarber) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(bookingsOfBarber);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to fetch bookings",
                });
            }
        };
    }
};
exports.BookingController = BookingController;
exports.BookingController = BookingController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IBookingService)),
    __metadata("design:paramtypes", [Object])
], BookingController);
