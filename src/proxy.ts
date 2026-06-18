import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAdminSubdomain(request: NextRequest) {
  const host = request.headers.get("host") || "";
  return host.startsWith("admin.");
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSubdomain = isAdminSubdomain(request);

  if (adminSubdomain) {
    // Don't rewrite API routes — they're already at the right path
    if (pathname.startsWith("/api/")) return NextResponse.next();

    const token = request.cookies.get("admin_token")?.value;

    // Login page
    if (pathname === "/login") {
      return NextResponse.rewrite(new URL("/admin/login", request.url));
    }

    // Auth check — redirect to /login on the same subdomain
    if (token !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Rewrite / → /admin/profile, /about → /admin/about, etc.
    const rewritePath = pathname === "/" ? "/admin/profile" : `/admin${pathname}`;
    return NextResponse.rewrite(new URL(rewritePath, request.url));
  }

  // Fallback: protect /admin/* on the main domain (local dev without subdomain)
  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/login")) return NextResponse.next();

    const token = request.cookies.get("admin_token")?.value;
    if (token !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
