import mongoose, { FilterQuery, UpdateResult } from "mongoose";
import { BookingCreateRequestDto } from "../dto/booking.dto";
import Booking, { IBooking } from "../models/booking.model";
import { BaseRepository } from "./base.repository";
import { IBookingRepository } from "./interfaces/IBookingRepository";
import { injectable } from "inversify";
import { DASHBOARDFILTERS } from "../utils/constants";

@injectable()
export class BookingRepository
  extends BaseRepository<IBooking>
  implements IBookingRepository
{
  constructor() {
    super(Booking);
  }

  async findSimilarBooking(
    data: BookingCreateRequestDto
  ): Promise<IBooking | null> {
    return await Booking.findOne({
      barber: data.barberId,
      "slotDetails.date": data.date,
      "slotDetails.startTime": data.startTime,
      "slotDetails.endTime": data.endTime,
    });
  }

  async findWithPaginationAndCount(
    filter: FilterQuery<IBooking>,
    skip: number,
    limit: number,
    sort: {
      createdAt?: 1 | -1;
      totalPrice?: 1 | -1;
    }
  ): Promise<{ bookings: IBooking[]; totalCount: number }> {
    const bookingsPromise = await Booking.find(filter)
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

  async updateAfterVerfyPayment(
    bookingId: string
  ): Promise<UpdateResult | null> {
    return await Booking.findByIdAndUpdate(
      bookingId,
      {
        $set: { status: "pending" },
        $unset: { expiresAt: "" },
      },
      { new: true }
    );
  }

  async getDashboardStats(
    filter: string,
    barberId?: string
  ): Promise<{
    filter: string;
    bookings: {
      type: "bookings";
      labels: string[];
      data: number[];
      total: number;
    };
    revenue: {
      type: "revenue";
      labels: string[];
      data: number[];
      total: number;
    };
    services: {
      type: "services";
      labels: string[];
      data: number[];
      total: number;
    };
  }> {
    const now = new Date();
    let filterDate: Date;

    switch (filter) {
      case DASHBOARDFILTERS.DAY:
        filterDate = new Date(now);
        filterDate.setDate(now.getDate() - 1);
        break;
      case DASHBOARDFILTERS.WEEK:
        filterDate = new Date(now);
        filterDate.setDate(now.getDate() - 7);
        break;
      case DASHBOARDFILTERS.MONTH:
        filterDate = new Date(now);
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case DASHBOARDFILTERS.YEAR:
        filterDate = new Date(now);
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        throw new Error("Invalid filter");
    }

    const matchStage: any = {
      createdAt: { $gte: filterDate, $lte: now },
      status: { $nin: ["cancelled_by_user", "cancelled_by_barber"] },
    };
    if (barberId) matchStage.barber = new mongoose.Types.ObjectId(barberId);

    const groupFormat =
      filter === "1 Year"
        ? { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
        : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };

    // BOOKINGS
    const bookingsResult = await Booking.aggregate([
      { $match: matchStage },
      { $group: { _id: groupFormat, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    let bookingsLabels = bookingsResult.map((r) => r._id);
    let bookingsData = bookingsResult.map((r) => r.count);
    if (bookingsLabels.length === 0) {
      const formatted =
        filter === "1 Year"
          ? now.toISOString().slice(0, 7)
          : now.toISOString().slice(0, 10);
      bookingsLabels = [formatted];
      bookingsData = [0];
    }
    const bookingsTotal = bookingsData.reduce((sum, val) => sum + val, 0);

    // REVENUE
    const revenueResult = await Booking.aggregate([
      { $match: matchStage },
      { $group: { _id: groupFormat, totalRevenue: { $sum: "$totalPrice" } } },
      { $sort: { _id: 1 } },
    ]);

    let revenueLabels = revenueResult.map((r) => r._id);
    let revenueData = revenueResult.map((r) => r.totalRevenue);
    if (revenueLabels.length === 0) {
      const formatted =
        filter === "1 Year"
          ? now.toISOString().slice(0, 7)
          : now.toISOString().slice(0, 10);
      revenueLabels = [formatted];
      revenueData = [0];
    }
    const revenueTotal = revenueData.reduce((sum, val) => sum + val, 0);

    // SERVICES (group by service name)
    const servicesResult = await Booking.aggregate([
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
}
