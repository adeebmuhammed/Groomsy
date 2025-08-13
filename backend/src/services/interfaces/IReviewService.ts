import { MessageResponseDto } from "../../dto/base.dto";
import { ReviewCreateRequestDto } from "../../dto/review.dto";

export interface IReviewService{
    create( userId: string, bookingId: string, reviewData: ReviewCreateRequestDto):Promise<{ response: MessageResponseDto, status: number}>;
    delete( reviewId: string):Promise<{ response: MessageResponseDto, status: number}>;
}