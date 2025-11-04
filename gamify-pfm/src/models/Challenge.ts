import mongoose, { Schema, Document, models } from "mongoose";

export interface IChallenge extends Document {
  title: string;
  description?: string;
  rule: Record<string, unknown>;
  rewardPoints: number;
  badge?: string;
  isActive: boolean;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true },
    description: String,
    rule: { type: Object, required: true },
    rewardPoints: { type: Number, default: 0 },
    badge: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Challenge =
  models.Challenge || mongoose.model<IChallenge>("Challenge", ChallengeSchema);

export default Challenge;
