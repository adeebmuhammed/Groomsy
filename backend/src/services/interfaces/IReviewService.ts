import { ListResponseDto } from "../../dto/admin.dto";
import { MessageResponseDto } from "../../dto/base.dto";
import { ReviewCreateRequestDto, ReviewResponseDto } from "../../dto/review.dto";

export interface IReviewService{
    getReviewsByUser(userId: string, page: number, limit: number): Promise<{ response: ListResponseDto<ReviewResponseDto>}>
    create( userId: string, bookingId: string, reviewData: ReviewCreateRequestDto):Promise<{ response: MessageResponseDto}>;
    delete( reviewId: string):Promise<{ response: MessageResponseDto}>;
}