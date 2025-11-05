import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password)
      return Response.json({ message: "Email and password required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user)
      return Response.json({ message: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return Response.json({ message: "Invalid password" }, { status: 401 });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    );

    return Response.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error: unknown) {
  if (error instanceof Error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
  return Response.json({ message: "Unknown error" }, { status: 500 });
  }
}