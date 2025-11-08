"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarberUnavailabilityMapper = void 0;
class BarberUnavailabilityMapper {
    static toBarberUnavailabilityDto(data) {
        return {
            id: data._id.toString(),
            barber: data.barber.toString(),
            weeklyOff: data.weeklyOff,
            specialOffDays: data.specialOffDays,
        };
    }
}
exports.BarberUnavailabilityMapper = BarberUnavailabilityMapper;
