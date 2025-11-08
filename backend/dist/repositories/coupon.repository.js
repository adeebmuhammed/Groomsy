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
exports.CouponResitory = void 0;
const coupon_model_1 = __importDefault(require("../models/coupon.model"));
const base_repository_1 = require("./base.repository");
const inversify_1 = require("inversify");
let CouponResitory = class CouponResitory extends base_repository_1.BaseRepository {
    constructor() {
        super(coupon_model_1.default);
    }
    async findByCodeOrName(code, name) {
        return await coupon_model_1.default.findOne({ $or: [{ code }, { name }] });
    }
    async deleteCoupon(couponId) {
        return await coupon_model_1.default.deleteOne({ _id: couponId });
    }
    async findAllCoupons(search, page, limit) {
        const skip = (page - 1) * limit;
        const condition = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            }
            : {};
        const [coupons, totalCount] = await Promise.all([
            this.findWithPagination(condition, skip, limit),
            this.countDocuments(condition),
        ]);
        return { coupons, totalCount };
    }
};
exports.CouponResitory = CouponResitory;
exports.CouponResitory = CouponResitory = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CouponResitory);
