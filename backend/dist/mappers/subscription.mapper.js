"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionMapper = void 0;
class SubscriptionMapper {
    static toSuscriptionResponse(data) {
        return {
            id: data._id.toString(),
            barber: data.barber.toString(),
            plan: data.plan.toString(),
            expiryDate: data.expiryDate,
            status: data.status,
            razorpayOrderId: data.razorpayOrderId
        };
    }
}
exports.SubscriptionMapper = SubscriptionMapper;
