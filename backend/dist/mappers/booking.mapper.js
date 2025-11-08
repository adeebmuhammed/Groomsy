"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingMapper = void 0;
class BookingMapper {
    static toBookingResponse(data) {
        return {
            id: data._id.toString(),
            user: data.user.toString(),
            barber: data.barber.toString(),
            totalPrice: data.totalPrice,
            service: data.service.toString(),
            status: data.status,
            finalPrice: data.finalPrice,
            discountAmount: data.discountAmount,
            couponCode: data.couponCode,
            slotDetails: {
                startTime: data.slotDetails.startTime,
                endTime: data.slotDetails.endTime,
                date: data.slotDetails.date,
            },
        };
    }
    static toBookingResponseArray(bookings) {
        return bookings.map((booking) => this.toBookingResponse(booking));
    }
}
exports.BookingMapper = BookingMapper;
