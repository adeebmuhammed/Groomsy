import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  barber: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  slotDetails: {
    startTime: Date;
    endTime: Date;
    date: Date;
  };
  totalPrice: number;
  finalPrice?: number;
  couponCode?: string;
  discountAmount?: number;
  status:
    | "staged"
    | "pending"
    | "cancelled_by_barber"
    | "cancelled_by_user"
    | "finished";
  razorpayOrderId?:string;
  expiresAt?:Date;
}

const BookingSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, required: true },
  barber: { type: mongoose.Types.ObjectId, required: true },
  service: { type: mongoose.Types.ObjectId, required: true },
  slotDetails: {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    date: { type: Date, required: true },
  },
  totalPrice: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  couponCode: { type: String, required: false },
  discountAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: [
      "staged",
      "pending",
      "cancelled_by_barber",
      "cancelled_by_user",
      "finished",
    ],
    default: "staged",
  },
  razorpayOrderId: {
    type: String,
    required: false,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000),
    index: { expires: "0s" },
  },
});

const Booking = mongoose.model<IBooking>("Bookings", BookingSchema);
export default Booking;
