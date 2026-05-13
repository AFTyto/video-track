// Stripe sandbox webhook disabled for VideoTrack
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ received: true });
}