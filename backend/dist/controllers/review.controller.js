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
exports.ReviewController = void 0;
const inversify_1 = require("inversify");
const constants_1 = require("../utils/constants");
const types_1 = require("../config/types");
let ReviewController = class ReviewController {
    constructor(_reviewService) {
        this._reviewService = _reviewService;
        this.getReviewsByUser = async (req, res) => {
            try {
                const userId = req.params["id"];
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;
                const { response } = await this._reviewService.getReviewsByUser(userId, page, limit);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to get reviews",
                });
            }
        };
        this.create = async (req, res) => {
            try {
                const userId = req.query.userId;
                const bookingId = req.query.bookingId;
                const data = req.body;
                const { response } = await this._reviewService.create(userId, bookingId, data);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.CREATED;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to create review",
                });
            }
        };
        this.delete = async (req, res) => {
            try {
                const reviewId = req.params["id"];
                const { response } = await this._reviewService.delete(reviewId);
                let status;
                if (response) {
                    status = constants_1.STATUS_CODES.OK;
                }
                else {
                    status = constants_1.STATUS_CODES.CONFLICT;
                }
                res.status(status).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(constants_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    error: error instanceof Error ? error.message : "Failed to delete review",
                });
            }
        };
    }
};
exports.ReviewController = ReviewController;
exports.ReviewController = ReviewController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IReviewService)),
    __metadata("design:paramtypes", [Object])
], ReviewController);
