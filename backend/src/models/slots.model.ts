import mongoose, { Document, Schema } from 'mongoose';

interface DaySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ISlotRule extends Document {
  slots: DaySlot[];
  barber: mongoose.Types.ObjectId;
}

const SlotRuleSchema: Schema = new Schema({
  slots: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }
  ],
  barber: { type: mongoose.Types.ObjectId, ref: 'Barber', required: true }
}, { timestamps: true });

const SlotRules = mongoose.model<ISlotRule>('SlotRule', SlotRuleSchema);
export default SlotRules;