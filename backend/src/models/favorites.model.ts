import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorites extends Document {
  userId: mongoose.Types.ObjectId;
  barbers: { barberId: mongoose.Types.ObjectId }[];
}

const FavoriteSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
  barbers: [
    {
      barberId: { type: mongoose.Types.ObjectId, ref: 'Barber', required: true }
    }
  ]
});


const Favorites = mongoose.model<IFavorites>("Favorites",FavoriteSchema)
export default Favorites;