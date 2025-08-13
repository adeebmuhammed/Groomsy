import { DeleteResult } from "mongoose";
import { ReviewCreateRequestDto } from "../../dto/review.dto";
import { IReview } from "../../models/review.model";
import { IBaseRepository } from "./IBaseRepository";

export interface IReviewRepository extends IBaseRepository<IReview>{
    createReview(userId:string,bookingId:string,barberId:string,reviewData: ReviewCreateRequestDto): Promise< IReview | null>;
    deleteReview(reviewId: string):Promise<DeleteResult | null>
}