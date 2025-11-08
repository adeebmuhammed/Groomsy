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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_mapper_1 = require("../mappers/review.mapper");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
const constants_1 = require("../utils/constants");
let ReviewService = class ReviewService {
    constructor(_reviewRepo, _userRepo, _bookingRepo) {
        this._reviewRepo = _reviewRepo;
        this._userRepo = _userRepo;
        this._bookingRepo = _bookingRepo;
        this.getReviewsByUser = async (userId, page, limit) => {
            const user = await this._userRepo.findById(userId);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
            }
            const { reviews, totalCount } = await this._reviewRepo.findAllReviews(page, limit, userId);
            const response = {
                data: review_mapper_1.ReviewMapper.toReviewResponseArray(reviews),
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
            };
        };
        this.create = async (userId, bookingId, reviewData) => {
            const user = await this._userRepo.findById(userId);
            if (!user) {
                throw new Error(constants_1.MESSAGES.ERROR.USER_NOT_FOUND);
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
            const review = await this._reviewRepo.createReview(userId, bookingId, booking.barber.toString(), reviewData);
            if (!review) {
                throw new Error("review creation failed");
            }
            return {
                response: { message: "review created successfully" },
            };
        };
        this.delete = async (reviewId) => {
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
            };
        };
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IReviewRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.IBookingRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], ReviewService);
