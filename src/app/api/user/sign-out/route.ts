import { sessionCookie } from "@/lib/const";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set(sessionCookie, "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return NextResponse.json({
    status: "success",
    message: "User signed out successfully.",
  });
}
