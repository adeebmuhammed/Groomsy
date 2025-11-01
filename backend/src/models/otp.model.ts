import mongoose, { Document, Schema } from "mongoose";
import { ROLES } from "../utils/constants";

export interface IOtp extends Document {
  otp: string | null;
  role: ROLES.BARBER | ROLES.USER;
  userId: mongoose.Schema.Types.ObjectId;
  expiresAt: Date;
}

const OtpSchema: Schema = new Schema(
  {
    otp: { type: String, required: true },
    role: { type: String, enum: [ROLES.BARBER, ROLES.USER], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
      index: { expires: "0s" },
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model<IOtp>("Otp", OtpSchema);
export default Otp;
