import { DeleteResult } from "mongoose";
import Coupons, { ICoupon } from "../models/coupon.model";
import { BaseRepository } from "./base.repository";
import { ICouponRepository } from "./interfaces/ICouponRepository";
import { injectable } from "inversify";

@injectable()
export class CouponResitory
  extends BaseRepository<ICoupon>
  implements ICouponRepository
{
  constructor() {
    super(Coupons);
  }

  async findByCodeOrName(code: string, name: string): Promise<ICoupon | null> {
    return await Coupons.findOne({ $or: [{ code }, { name }] });
  }

  async deleteCoupon(couponId: string): Promise<DeleteResult> {
    return await Coupons.deleteOne({ _id: couponId });
  }

  async findAllCoupons(
    search: string,
    page: number,
    limit: number
  ): Promise<{ coupons: ICoupon[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const condition = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [coupons, totalCount] = await Promise.all([
      this.findWithPagination(condition, skip, limit),
      this.countDocuments(condition),
    ]);

    return { coupons, totalCount };
  }
}
