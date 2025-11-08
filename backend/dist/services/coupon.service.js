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
exports.CouponService = void 0;
const coupon_mapper_1 = require("../mappers/coupon.mapper");
const couponValidator_1 = require("../utils/couponValidator");
const inversify_1 = require("inversify");
const types_1 = require("../config/types");
let CouponService = class CouponService {
    constructor(_couponRepo) {
        this._couponRepo = _couponRepo;
        this.getAllCoupons = async (search, page, limit) => {
            const { totalCount, coupons } = await this._couponRepo.findAllCoupons(search, page, limit);
            const response = {
                data: coupon_mapper_1.Couponmapper.toCouponDtoArray(coupons),
                message: "Coupons fetched successfully",
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit
                }
            };
            return {
                response,
            };
        };
        this.createCoupon = async (data) => {
            const errors = (0, couponValidator_1.validateCouponData)(data);
            if (errors.length > 0) {
                throw new Error(errors.join(" "));
            }
            const existingCodeOrName = await this._couponRepo.findByCodeOrName(data.code, data.name);
            if (existingCodeOrName) {
                throw new Error("coupon with the code or name exists, please try again with new ones");
            }
            const newCoupon = this._couponRepo.create(data);
            if (!newCoupon) {
                throw new Error("coupon creation failed");
            }
            return {
                response: coupon_mapper_1.Couponmapper.toMessageResponse("coupon created successfully"),
            };
        };
        this.updateCoupon = async (couponId, data) => {
            const errors = (0, couponValidator_1.validateCouponData)(data);
            if (errors.length > 0) {
                throw new Error(errors.join(" "));
            }
            const existingCoupon = await this._couponRepo.findById(couponId);
            if (!existingCoupon) {
                throw new Error("coupon not found");
            }
            const updatedCoupon = await this._couponRepo.update(couponId, data);
            if (!updatedCoupon) {
                throw new Error("coupon updation failed");
            }
            return {
                response: coupon_mapper_1.Couponmapper.toMessageResponse("coupon updated successfully"),
            };
        };
        this.deleteCoupon = async (couponId) => {
            if (!couponId) {
                throw new Error("coupon id required");
            }
            const existingCoupon = await this._couponRepo.findById(couponId);
            if (!existingCoupon) {
                throw new Error("coupon not found");
            }
            const deleteCoupon = this._couponRepo.deleteCoupon(couponId);
            if (!deleteCoupon) {
                throw new Error("coupon deletion failed");
            }
            return {
                response: coupon_mapper_1.Couponmapper.toMessageResponse("coupon deleted successfully")
            };
        };
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ICouponRepository)),
    __metadata("design:paramtypes", [Object])
], CouponService);
