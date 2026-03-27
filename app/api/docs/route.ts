import { NextResponse } from "next/server";
import { docsData } from "@/lib/docs-data";
 
export async function GET() {
  return NextResponse.json(docsData, { status: 200 });
}