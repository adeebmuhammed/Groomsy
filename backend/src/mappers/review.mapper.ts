import mongoose from "mongoose";
import { ReviewResponseDto } from "../dto/review.dto";
import { IReview } from "../models/review.model";

export class ReviewMapper {
  static toReviewResponse(data: IReview): ReviewResponseDto {
    return {
      id: (data._id as mongoose.Types.ObjectId).toString(),
      barber: (data.barber as mongoose.Types.ObjectId).toString(),
      booking: (data.booking as mongoose.Types.ObjectId).toString(),
      rating: data.rating,
      reviewText: data.reviewText,
    };
  }

  static toReviewResponseArray(reviews: IReview[]):ReviewResponseDto[]{
    return reviews.map(review => this.toReviewResponse(review))
  }
}
