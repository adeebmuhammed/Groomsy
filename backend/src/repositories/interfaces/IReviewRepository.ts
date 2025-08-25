import { DeleteResult } from "mongoose";
import { ReviewCreateRequestDto } from "../../dto/review.dto";
import { IReview } from "../../models/review.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IReviewRepository extends IBaseRepository<IReview>{
    findAllReviews(page: number,limit: number,userId:string): Promise<{ reviews: IReview[]; totalCount: number }>
    createReview(userId:string,bookingId:string,barberId:string,reviewData: { reviewText: string, rating: number;}): Promise< IReview | null>;
    deleteReview(reviewId: string):Promise<DeleteResult | null>
}