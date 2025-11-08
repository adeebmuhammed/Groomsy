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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const base_repository_1 = require("./base.repository");
const inversify_1 = require("inversify");
const constants_1 = require("../utils/constants");
let BookingRepository = class BookingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(booking_model_1.default);
    }
    async findSimilarBooking(data) {
        return await booking_model_1.default.findOne({
            barber: data.barberId,
            "slotDetails.date": data.date,
            "slotDetails.startTime": data.startTime,
            "slotDetails.endTime": data.endTime,
        });
    }
    async findWithPaginationAndCount(filter, skip, limit, sort) {
        const bookingsPromise = await booking_model_1.default.find(filter)
            .sort(sort) // ✅ directly applied here
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = this.countDocuments(filter);
        const [bookings, totalCount] = await Promise.all([
            bookingsPromise,
            countPromise,
        ]);
        return { bookings, totalCount };
    }
    async updateAfterVerfyPayment(bookingId) {
        return await booking_model_1.default.findByIdAndUpdate(bookingId, {
            $set: { status: "pending" },
            $unset: { expiresAt: "" },
        }, { new: true });
    }
    async getDashboardStats(filter, barberId) {
        const now = new Date();
        let filterDate;
        switch (filter) {
            case constants_1.DASHBOARDFILTERS.DAY:
                filterDate = new Date(now);
                filterDate.setDate(now.getDate() - 1);
                break;
            case constants_1.DASHBOARDFILTERS.WEEK:
                filterDate = new Date(now);
                filterDate.setDate(now.getDate() - 7);
                break;
            case constants_1.DASHBOARDFILTERS.MONTH:
                filterDate = new Date(now);
                filterDate.setMonth(now.getMonth() - 1);
                break;
            case constants_1.DASHBOARDFILTERS.YEAR:
                filterDate = new Date(now);
                filterDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                throw new Error("Invalid filter");
        }
        const matchStage = {
            createdAt: { $gte: filterDate, $lte: now },
            status: { $nin: ["cancelled_by_user", "cancelled_by_barber"] },
        };
        if (barberId)
            matchStage.barber = new mongoose_1.default.Types.ObjectId(barberId);
        const groupFormat = filter === "1 Year"
            ? { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
            : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        // BOOKINGS
        const bookingsResult = await booking_model_1.default.aggregate([
            { $match: matchStage },
            { $group: { _id: groupFormat, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);
        let bookingsLabels = bookingsResult.map((r) => r._id);
        let bookingsData = bookingsResult.map((r) => r.count);
        if (bookingsLabels.length === 0) {
            const formatted = filter === "1 Year"
                ? now.toISOString().slice(0, 7)
                : now.toISOString().slice(0, 10);
            bookingsLabels = [formatted];
            bookingsData = [0];
        }
        const bookingsTotal = bookingsData.reduce((sum, val) => sum + val, 0);
        // REVENUE
        const revenueResult = await booking_model_1.default.aggregate([
            { $match: matchStage },
            { $group: { _id: groupFormat, totalRevenue: { $sum: "$totalPrice" } } },
            { $sort: { _id: 1 } },
        ]);
        let revenueLabels = revenueResult.map((r) => r._id);
        let revenueData = revenueResult.map((r) => r.totalRevenue);
        if (revenueLabels.length === 0) {
            const formatted = filter === "1 Year"
                ? now.toISOString().slice(0, 7)
                : now.toISOString().slice(0, 10);
            revenueLabels = [formatted];
            revenueData = [0];
        }
        const revenueTotal = revenueData.reduce((sum, val) => sum + val, 0);
        // SERVICES (group by service name)
        const servicesResult = await booking_model_1.default.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "services",
                    localField: "service",
                    foreignField: "_id",
                    as: "serviceDetails",
                },
            },
            { $unwind: "$serviceDetails" },
            { $group: { _id: "$serviceDetails.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        let serviceLabels = servicesResult.map((r) => r._id);
        let serviceData = servicesResult.map((r) => r.count);
        if (serviceLabels.length === 0) {
            serviceLabels = ["No Services"];
            serviceData = [0];
        }
        const serviceTotal = serviceData.reduce((sum, val) => sum + val, 0);
        return {
            filter,
            bookings: {
                type: "bookings",
                labels: bookingsLabels,
                data: bookingsData,
                total: bookingsTotal,
            },
            revenue: {
                type: "revenue",
                labels: revenueLabels,
                data: revenueData,
                total: revenueTotal,
            },
            services: {
                type: "services",
                labels: serviceLabels,
                data: serviceData,
                total: serviceTotal,
            },
        };
    }
    async deleteBooking(bookingId) {
        return await booking_model_1.default.deleteOne({ _id: bookingId });
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookingRepository);
