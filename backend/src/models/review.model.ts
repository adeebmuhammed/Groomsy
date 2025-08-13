import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  barber: mongoose.Types.ObjectId;
  rating: number;
  reviewText: string;
}

const ReviewSchema: Schema = new Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    booking: { type: mongoose.Types.ObjectId, required: true, ref: "Bookings" },
    barber: { type: mongoose.Types.ObjectId, required: true, ref: "Barber" },
    rating: { type: Number, required: true },
    reviewText: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review",ReviewSchema)
export default Review;