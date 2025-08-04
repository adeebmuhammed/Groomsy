import mongoose, { Document, Schema } from "mongoose";

export interface IOffer extends Document{
    name: string;
    startDate: Date;
    endDate: Date;
    discount: number;
}

const OfferSchema: Schema = new Schema({
    name: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    discount: {type: Number, required : true},
},{ timestamps: true });

const Offers = mongoose.model<IOffer>("Offers",OfferSchema)
export default Offers;