import mongoose, { Mongoose,Document,Schema,ObjectId } from "mongoose";

export interface IBarber extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  district: string;
  status:   "blocked" | "active" ;
  isVerified: boolean;
  otp?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const BarberSchema : Schema = new Schema ({
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    district: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "blocked", "active", "rejected"],
      default: "active",
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
  },
  { timestamps: true }
)

const Barbers = mongoose.model<IBarber>("Barber",BarberSchema)
export default Barbers;