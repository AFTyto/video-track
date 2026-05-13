import {
  APP_HOSTNAMES,
} from "@dub/utils";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { AppMiddleware } from "./lib/middleware/app";
import { parse } from "./lib/middleware/utils/parse";

export const config = {
  matcher: [
    "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain, path } = parse(req);

  if (APP_HOSTNAMES.has(domain)) {
    return AppMiddleware(req);
  }

  return NextResponse.next();
}
