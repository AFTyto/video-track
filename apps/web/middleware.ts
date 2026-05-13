import { NextResponse } from "next/server";

export const config = {
  api: {
    externalResolver: true,
  },
  matcher: [
    "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};

export default function middleware() {
  return NextResponse.next();
}
