import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return Response.json({ message: "All fields are required" }, { status: 400 });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return Response.json({ message: "User already exists" }, { status: 409 });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
    });

    return Response.json(
      {
        success: true,
        message: "User registered successfully",
        user: { id: newUser._id, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return Response.json(
      { success: false, message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
