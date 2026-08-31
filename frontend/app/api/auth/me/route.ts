import { NextRequest, NextResponse } from "next/server";
import { verifyJwt, findUserByEmail, COOKIE_NAME } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = await verifyJwt(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  const user = await findUserByEmail(payload.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id:            user.id,
    name:          user.name,
    email:         user.email,
    walletAddress: user.walletAddress,
    city:          user.city,
    role:          user.role,
    joinedAt:      user.joinedAt,
  });
}
