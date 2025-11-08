"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanMapper = void 0;
class PlanMapper {
    static toPlanResponse(data) {
        return {
            id: data._id.toString(),
            name: data.name,
            price: data.price,
            renewalPrice: data.renewalPrice,
            description: data.description,
            duration: data.duration,
            durationUnit: data.durationUnit,
            isActive: data.isActive,
            features: data.features
        };
    }
    static toPlanResponseArray(plans) {
        return plans.map((plan) => PlanMapper.toPlanResponse(plan));
    }
}
exports.PlanMapper = PlanMapper;
