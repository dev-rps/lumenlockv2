import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, signJwt, COOKIE_NAME } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await verifyCredentials(email.trim().toLowerCase(), password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await signJwt(user);

    const res = NextResponse.json({
      ok:   true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, walletAddress: user.walletAddress },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24 * 7,
      path:     "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
