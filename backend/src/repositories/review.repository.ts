import { DeleteResult } from "mongoose";
import { ReviewCreateRequestDto } from "../dto/review.dto";
import Review, { IReview } from "../models/review.model";
import { BaseRepository } from "./base.repository";
import { IReviewRepository } from "./interfaces/IReviewRepository";

export class ReviewRepository
  extends BaseRepository<IReview>
  implements IReviewRepository
{
  constructor() {
    super(Review);
  }

  async findAllReviews(
    page: number,
    limit: number,
    userId: string
  ): Promise<{ reviews: IReview[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const [reviews, totalCount] = await Promise.all([
      this.findWithPagination({user:userId}, skip, limit),
      this.countDocuments({user:userId}),
    ]);

    return { reviews, totalCount };
  }

  async createReview(
    userId: string,
    bookingId: string,
    barberId: string,
    reviewData: ReviewCreateRequestDto
  ): Promise<IReview | null> {
    return await Review.create({
      user: userId,
      booking: bookingId,
      barber: barberId,
      reviewText: reviewData.reviewText,
      rating: reviewData.rating,
    });
  }

  async deleteReview(reviewId: string): Promise<DeleteResult | null> {
    return await Review.deleteOne({ _id: reviewId });
  }
}
