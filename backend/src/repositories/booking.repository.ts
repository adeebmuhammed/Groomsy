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

  async getBookingStats(barberId: string, filter: DASHBOARDFILTERS): Promise<{labels: string[], counts: number[]}> {
    const now = new Date();
    let startDate: Date;
    let groupFormat: string;

    switch (filter) {
      case DASHBOARDFILTERS.WEEK:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6); // last 7 days
        groupFormat = "%Y-%m-%d"; // group by day
        break;
      case DASHBOARDFILTERS.MONTH:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 27); // last 4 weeks
        groupFormat = "%Y-%U"; // group by week number
        break;
      case DASHBOARDFILTERS.YEAR:
        startDate = new Date(now.getFullYear(), 0, 1); // start of this year
        groupFormat = "%Y-%m"; // group by month
        break;
      default:
        throw new Error("Invalid filter");
    }

    const stats = await Booking.aggregate([
      {
        $match: {
          barber: barberId,
          "slotDetails.date": { $gte: startDate, $lte: now },
          status: { $ne: "staged" },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: "$slotDetails.date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = stats.map((s) => s._id);
    const counts = stats.map((s) => s.count);

    return { labels, counts };
  }
}
