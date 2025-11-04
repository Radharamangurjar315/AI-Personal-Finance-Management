import mongoose, { Schema, Document, models } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: "income" | "expense";
  category: string;
  merchant?: string;
  occurredAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, default: "uncategorized" },
    merchant: String,
    occurredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Transaction =
  models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
