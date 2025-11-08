"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceMapper = void 0;
class ServiceMapper {
    static toServiceDtoArray(services) {
        return services.map((service) => ServiceMapper.toServiceResponse(service));
    }
    static toServiceResponse(data) {
        return {
            id: data._id.toString(),
            name: data.name,
            description: data.description,
            duration: data.duration,
            price: data.price,
        };
    }
}
exports.ServiceMapper = ServiceMapper;
