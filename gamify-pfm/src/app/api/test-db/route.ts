import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";


export async function GET() {
  try {
    
    await connectDB();
    const userCount = await User.countDocuments();

    return Response.json({
      success: true,
      message: "MongoDB connection successful!",
      userCount,
    });
  } catch (error) {
    console.error("MongoDB test error:", error);
    return Response.json(
      {
        success: false,
        message: "MongoDB connection failed!",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
