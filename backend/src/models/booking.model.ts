import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  barber: mongoose.Types.ObjectId;
  totalPrice: number;
  status: "pending" | "cancelled_by_barber" | "cancelled_by_user" | "cancelled_by_admin" | "finished";
  slotDetails: {
    startTime: Date;
    endTime: Date;
    date: Date;
  };
}

const BookingSchema: Schema = new Schema({
  user: { type: mongoose.Types.ObjectId, required: true },
  barber: { type: mongoose.Types.ObjectId, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "cancelled_by_barber", "cancelled_by_user", "cancelled_by_admin", "finished"],
    default: "pending",
  },
  slotDetails: {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    date: { type: Date, required: true },
  },
});

const Booking = mongoose.model<IBooking>("Bookings",BookingSchema)
export default Booking;