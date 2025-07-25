import mongoose, { Document,Schema,ObjectId} from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  status: "active" | "blocked";
  googleId?: string;
  otp?:string | null;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function (this: { googleId?: string }) {
        return !this.googleId;
      },
    },
    phone: { type: String, trim: true, default: null },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    googleId: { type: String, default: null },
    otp: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Users = mongoose.model<IUser>("User", UserSchema);
export default Users;