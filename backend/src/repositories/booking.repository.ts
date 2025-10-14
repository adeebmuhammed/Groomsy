import { FilterQuery, UpdateResult } from "mongoose";
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
    limit: number
  ): Promise<{ bookings: IBooking[]; totalCount: number }> {
    const [bookings, totalCount] = await Promise.all([
      this.findWithPagination(filter, skip, limit),
      this.countDocuments(filter),
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
    type: "bookings" | "revenue"
  ): Promise<{
    labels: string[];
    data: number[];
    type: "bookings" | "revenue";
    filter: string;
    total?: number;
  }> {
    const now = new Date();
    let filterDate: Date;

    switch (filter) {
      case "1 Day":
        filterDate = new Date(now);
        filterDate.setDate(now.getDate() - 1);
        break;
      case "1 Week":
        filterDate = new Date(now);
        filterDate.setDate(now.getDate() - 7);
        break;
      case "1 Month":
        filterDate = new Date(now);
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "1 Year":
        filterDate = new Date(now);
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        throw new Error("Invalid filter");
    }

    const matchStage = {
      createdAt: { $gte: filterDate, $lte: now },
      status: { $ne: "cancelled" },
    };

    const groupFormat =
      filter === "1 Year"
        ? { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
        : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };

    let aggregation: any[];

    if (type === "bookings") {
      aggregation = [
        { $match: matchStage },
        { $group: { _id: groupFormat, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ];
    } else {
      aggregation = [
        { $match: matchStage },
        { $group: { _id: groupFormat, totalRevenue: { $sum: "$totalPrice" } } },
        { $sort: { _id: 1 } },
      ];
    }

    const result = await Booking.aggregate(aggregation);

    let labels: string[] = result.map((r) => r._id);
    let data: number[] =
      type === "bookings"
        ? result.map((r) => r.count)
        : result.map((r) => r.totalRevenue);

    if (labels.length === 0 || data.length === 0) {
      const formattedDate =
        filter === "1 Year"
          ? now.toISOString().slice(0, 7)
          : now.toISOString().slice(0, 10);

      labels = [formattedDate];
      data = [0];
    }

    const total = data.reduce((sum, val) => sum + val, 0);

    return { labels, data, type, filter, total };
  }
}
