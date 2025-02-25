import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/signup", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/", "/cords(.*)", "/onboarding"],
};
