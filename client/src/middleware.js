import { NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["en", "hi", "bn"];
const DEFAULT_LOCALE = "en";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, internal Next paths, API routes, and manifest files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Check if pathname has a locale prefix: /en/..., /hi/..., /bn/...
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();

  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment)) {
    // Strip locale segment to get the underlying route
    const strippedPath = segments.slice(1).join("/");
    const targetUrl = new URL(strippedPath ? `/${strippedPath}` : "/", request.url);
    targetUrl.search = request.nextUrl.search;

    const response = NextResponse.rewrite(targetUrl);
    // Persist locale cookie
    response.cookies.set("NEXT_LOCALE", firstSegment, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    response.headers.set("x-next-intl-locale", firstSegment);
    return response;
  }

  // Non-prefixed routes: pass through, respecting existing NEXT_LOCALE cookie if set
  const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const effectiveLocale =
    savedLocale && SUPPORTED_LOCALES.includes(savedLocale) ? savedLocale : DEFAULT_LOCALE;

  const response = NextResponse.next();
  response.headers.set("x-next-intl-locale", effectiveLocale);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
