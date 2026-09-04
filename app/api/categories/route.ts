import { NextResponse } from "next/server";
import { getCategorySummaries } from "@/lib/serverData";

export async function GET() {
  const categories = await getCategorySummaries();
  return NextResponse.json(categories);
}
