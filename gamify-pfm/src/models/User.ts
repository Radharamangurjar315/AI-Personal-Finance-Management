import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
