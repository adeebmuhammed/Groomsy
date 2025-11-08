"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarberMapper = void 0;
class BarberMapper {
    static toLoginResponse(barber, message, token) {
        return {
            id: barber._id.toString(),
            name: barber.name,
            email: barber.email,
            phone: barber.phone,
            district: barber.district,
            status: barber.status,
            token,
            message,
        };
    }
    static toBarberDto(barber) {
        return {
            id: barber._id.toString(),
            name: barber.name,
            phone: barber.phone,
            district: barber.district,
            status: barber.status,
            profilePicUrl: barber.profilePicUrl,
            profilePicKey: barber.profilePicKey
        };
    }
    static toBarberDtoArray(barbers) {
        return barbers.map((barber) => this.toBarberDto(barber));
    }
    static toMessageResponse(message) {
        return { message };
    }
    static toBarberProfileDto(barber) {
        return {
            id: barber._id.toString(),
            name: barber.name,
            phone: barber.phone,
            email: barber.email,
            address: {
                district: barber.district || "",
                city: barber.address?.city || "",
                street: barber.address?.street || "",
                pincode: barber.address?.pincode || "",
            },
            profilePicUrl: barber.profilePicUrl,
            profilePicKey: barber.profilePicKey,
        };
    }
}
exports.BarberMapper = BarberMapper;
