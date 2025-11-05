import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token)
      return Response.json({ message: "Token required" }, { status: 400 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return Response.json({ valid: true, decoded });
  } catch (error: any) {
    return Response.json({ valid: false, message: error.message }, { status: 401 });
  }
}
