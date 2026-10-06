import { NextResponse } from "next/server";
import { backupToNeon } from "@/lib/backup";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Daily backup trigger. Vercel Cron (see vercel.json) or any scheduler calls this with
// `Authorization: Bearer <CRON_SECRET>`. Anything else is rejected.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await backupToNeon();
  if (!result.ok) console.error("Neon backup failed", result.error);
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
