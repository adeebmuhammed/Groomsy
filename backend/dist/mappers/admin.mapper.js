"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMapper = void 0;
class AdminMapper {
    static toLoginResponse(admin, message) {
        return {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            message,
        };
    }
    static toBarberDto(barber) {
        return {
            id: barber._id.toString(),
            name: barber.name,
            email: barber.email,
            status: barber.status,
            district: barber.district,
            createdAt: barber.createdAt,
        };
    }
    static toBarberDtoArray(barbers) {
        return barbers.map((barber) => this.toBarberDto(barber));
    }
}
exports.AdminMapper = AdminMapper;
