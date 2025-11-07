import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

//  GET: Fetch all transactions for logged-in user
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log(" No token found in GET /transactions");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      console.log(" Token missing userId");
      return NextResponse.json({ message: "Invalid token payload" }, { status: 400 });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error(" GET /transactions error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

//  POST: Create new transaction
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId || decoded.id;

    const { title, amount, type, category, notes } = await req.json();
    const newTransaction = await Transaction.create({
      userId,
      title,
      amount,
      type,
      category,
      notes,
    });

    return NextResponse.json({ message: "Transaction added", transaction: newTransaction });
  } catch (error) {
    console.error(" POST /transactions error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
