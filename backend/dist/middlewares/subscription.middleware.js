"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionMiddleware = void 0;
const constants_1 = require("../utils/constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const subscription_repository_1 = require("../repositories/subscription.repository");
const subscription_plan_repository_1 = require("../repositories/subscription.plan.repository");
const subscriptionMiddleware = (requiredFeature) => {
    return async (req, res, next) => {
        const token = req.cookies["auth-token"];
        if (!token) {
            res
                .status(constants_1.STATUS_CODES.UNAUTHORIZED)
                .json({ message: constants_1.MESSAGES.ERROR.UNAUTHORIZED });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (decoded.type !== "barber") {
                res
                    .status(constants_1.STATUS_CODES.FORBIDDEN)
                    .json({ message: constants_1.MESSAGES.ERROR.FORBIDDEN });
                return;
            }
            const _subscriptionRepo = new subscription_repository_1.SubscriptionRepository();
            const _planRepo = new subscription_plan_repository_1.SubscriptionPlanRepository();
            const subscription = await _subscriptionRepo.findOne({
                barber: decoded.userId,
            });
            if (!subscription) {
                res
                    .status(constants_1.STATUS_CODES.FORBIDDEN)
                    .json({ message: constants_1.MESSAGES.ERROR.FORBIDDEN });
                return;
            }
            const plan = await _planRepo.findById(subscription.plan.toString());
            if (plan && requiredFeature && !plan.features.includes(requiredFeature)) {
                res
                    .status(constants_1.STATUS_CODES.FORBIDDEN)
                    .json({
                    message: `Your plan does not allow access to ${requiredFeature}`,
                });
                return;
            }
            const today = new Date();
            if (subscription.expiryDate >= today &&
                subscription.status === "active") {
                return next();
            }
            if (subscription.expiryDate < today) {
                res
                    .status(constants_1.STATUS_CODES.FORBIDDEN)
                    .json({ message: "Subscription expired" });
                return;
            }
            if (subscription.status !== "active") {
                res
                    .status(constants_1.STATUS_CODES.FORBIDDEN)
                    .json({ message: "Subscription expired" });
                return;
            }
            return next();
        }
        catch (error) {
            console.error(error);
            res
                .status(constants_1.STATUS_CODES.UNAUTHORIZED)
                .json({ message: constants_1.MESSAGES.ERROR.INVALID_TOKEN });
            return;
        }
    };
};
exports.subscriptionMiddleware = subscriptionMiddleware;
