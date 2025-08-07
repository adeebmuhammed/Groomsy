import mongoose, { Document, Schema,Types } from "mongoose"

export interface IBarberUnavailability extends Document {
  barber: Types.ObjectId;
  weeklyOff: string;
  specialOffDays: { date: string; reason?: string }[];
}

const BarberUnavailabilitySchema: Schema = new Schema({
  barber: { type: Schema.Types.ObjectId, ref: "Barber", required: true, unique: true },

  weeklyOff: {
    type: String,
    enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },

  specialOffDays: [
    {
      date: { type: String, required: true },
      reason: { type: String },
    },
  ],
});

const BarberUnavailability = mongoose.model<IBarberUnavailability>("BarberUnavailability",BarberUnavailabilitySchema)
export default BarberUnavailability;