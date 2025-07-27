import mongoose, { Document, Schema } from 'mongoose';

export interface ISlot extends Document {
  startTime: Date;
  endTime: Date;
  price: number;
  date: Date;
  barber: mongoose.Types.ObjectId;
  isExpired: boolean;
  isBooked: boolean;
}

const SlotSchema: Schema = new Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  barber: { type: mongoose.Types.ObjectId, ref: 'Barber', required: true },
  isExpired: { type: Boolean, default: false },
  isBooked: { type: Boolean, default: false }
},{ timestamps: true });

const Slots = mongoose.model<ISlot>('Slot', SlotSchema);
export default Slots;