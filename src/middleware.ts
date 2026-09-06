import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoggedIn =
    request.cookies.has("devanagari-user-session") ||
    request.cookies
      .getAll()
      .some(
        (cookie) =>
          cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"),
      );

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/account")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
