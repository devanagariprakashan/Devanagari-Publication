import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Supabase access tokens last about an hour. Server Components can't write cookies, so without refreshing here the
// browser keeps a stale refresh token and the next page load signs the user out. Refreshing in middleware
// (where cookies can be written) keeps admin and customer sessions alive.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const hasAuthCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"));

  let signedIn = false;
  if (hasAuthCookie) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      },
    );
    // getUser() validates the session with Supabase and refreshes the tokens when they have expired.
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  }

  const needsLogin =
    (pathname.startsWith("/admin") && pathname !== "/admin/login" && !signedIn) ||
    (pathname.startsWith("/account") && !signedIn);

  if (needsLogin) {
    const target = pathname.startsWith("/admin")
      ? new URL("/admin/login", request.url)
      : new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url);
    const redirect = NextResponse.redirect(target);
    // Keep any cookie changes (e.g. a cleared dead session) on the redirect too.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
