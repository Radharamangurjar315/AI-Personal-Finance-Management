import mongoose, { Schema, Document, models } from "mongoose";

export interface IUserChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  progress: number;
  status: "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const UserChallengeSchema = new Schema<IUserChallenge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", required: true },
    progress: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
  },
  { timestamps: true }
);

const UserChallenge =
  models.UserChallenge ||
  mongoose.model<IUserChallenge>("UserChallenge", UserChallengeSchema);

export default UserChallenge;
