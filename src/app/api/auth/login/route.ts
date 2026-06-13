import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { setAuthCookie } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await db.user.findUnique({ where: { email: email?.toLowerCase()?.trim() } });
  if (!user) {
    return NextResponse.json({ error: "Бүртгэлтэй и-мэйл олдсонгүй." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Нууц үг буруу байна." }, { status: 401 });
  }

  await setAuthCookie({
    sub: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
  });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
  });
}
