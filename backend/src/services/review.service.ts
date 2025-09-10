import mongoose from "mongoose";
import { MessageResponseDto } from "../dto/base.dto";
import { ReviewCreateRequestDto, ReviewResponseDto } from "../dto/review.dto";
import { BookingRepository } from "../repositories/booking.repository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { IReviewRepository } from "../repositories/interfaces/IReviewRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { UserRepository } from "../repositories/user.repository";
import { IReviewService } from "./interfaces/IReviewService";
import { STATUS_CODES } from "../utils/constants";
import { ListResponseDto } from "../dto/admin.dto";
import { ReviewMapper } from "../mappers/review.mapper";
import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TYPES.IReviewRepository) private _reviewRepo: IReviewRepository,
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.IBookingRepository) private _bookingRepo: IBookingRepository
  ) {}

  getReviewsByUser = async (
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    response: ListResponseDto<ReviewResponseDto>;
    status: number;
  }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const { reviews, totalCount } = await this._reviewRepo.findAllReviews(
      page,
      limit,
      userId
    );

    const response: ListResponseDto<ReviewResponseDto> = {
      data: ReviewMapper.toReviewResponseArray(reviews),
      message: "reviews fetched successfully",
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    };

    return {
      response,
      status: STATUS_CODES.OK,
    };
  };

  create = async (
    userId: string,
    bookingId: string,
    reviewData: ReviewCreateRequestDto
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const booking = await this._bookingRepo.findById(bookingId);
    if (!booking) {
      throw new Error("booking not found");
    }

    const existingReview = await this._reviewRepo.findOne({
      booking: bookingId,
    });
    if (existingReview) {
      throw new Error("user already created review for this booking");
    }

    const review = await this._reviewRepo.createReview(
      userId,
      bookingId,
      (booking.barber as mongoose.Types.ObjectId).toString(),
      reviewData
    );
    if (!review) {
      throw new Error("review creation failed");
    }

    return {
      response: { message: "review created successfully" },
      status: STATUS_CODES.CREATED,
    };
  };

  delete = async (
    reviewId: string
  ): Promise<{ response: MessageResponseDto; status: number }> => {
    const review = await this._reviewRepo.findById(reviewId);
    if (!review) {
      throw new Error("review not found");
    }

    const deleted = await this._reviewRepo.deleteReview(reviewId);
    if (!deleted) {
      throw new Error("review deletion failed");
    }

    return {
      response: { message: "review deleted successfully" },
      status: STATUS_CODES.OK,
    };
  };
}
