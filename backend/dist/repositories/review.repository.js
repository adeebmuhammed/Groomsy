"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const review_model_1 = __importDefault(require("../models/review.model"));
const base_repository_1 = require("./base.repository");
const inversify_1 = require("inversify");
let ReviewRepository = class ReviewRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(review_model_1.default);
    }
    async findAllReviews(page, limit, userId) {
        const skip = (page - 1) * limit;
        const [reviews, totalCount] = await Promise.all([
            this.findWithPagination({ user: userId }, skip, limit),
            this.countDocuments({ user: userId }),
        ]);
        return { reviews, totalCount };
    }
    async createReview(userId, bookingId, barberId, reviewData) {
        return await review_model_1.default.create({
            user: userId,
            booking: bookingId,
            barber: barberId,
            reviewText: reviewData.reviewText,
            rating: reviewData.rating,
        });
    }
    async deleteReview(reviewId) {
        return await review_model_1.default.deleteOne({ _id: reviewId });
    }
};
exports.ReviewRepository = ReviewRepository;
exports.ReviewRepository = ReviewRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ReviewRepository);
