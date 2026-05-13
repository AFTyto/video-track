// Cron aggregate clicks disabled for VideoTrack
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Disabled for VideoTrack" });
}