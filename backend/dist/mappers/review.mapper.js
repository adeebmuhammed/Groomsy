"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewMapper = void 0;
class ReviewMapper {
    static toReviewResponse(data) {
        return {
            id: data._id.toString(),
            barber: data.barber.toString(),
            booking: data.booking.toString(),
            rating: data.rating,
            reviewText: data.reviewText,
        };
    }
    static toReviewResponseArray(reviews) {
        return reviews.map(review => this.toReviewResponse(review));
    }
}
exports.ReviewMapper = ReviewMapper;
