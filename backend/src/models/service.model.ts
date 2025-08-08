import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  duration: "15m" | "30m" | "45m" | "60m" | "75m" | "90" | "105" | "120";
  price: number;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: {
    type: String,
    enum: ["15m", "30m", "45m", "60m", "75m", "90", "105", "120"],
    required: true,
  },
});

const Service = mongoose.model<IService>("Service",ServiceSchema)
export default Service;