import mongoose, { Document, Schema } from 'mongoose';

interface DaySlot {
  day: string;
  startTime: Date;
  endTime: Date;
}

export interface ISlotRule extends Document {
  slots: DaySlot[];
  price: number;
  duration: string;
  barber: mongoose.Types.ObjectId;
}

const SlotRuleSchema: Schema = new Schema({
  slots: [
    {
      day: { type: String, required: true },
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true }
    }
  ],
  price: { type: Number, required: true },
  duration: { type: String, enum: ['30m', '1h', '1h 30m', '2h'], required: true },
  barber: { type: mongoose.Types.ObjectId, ref: 'Barber', required: true }
}, { timestamps: true });

const SlotRules = mongoose.model<ISlotRule>('SlotRule', SlotRuleSchema);
export default SlotRules;