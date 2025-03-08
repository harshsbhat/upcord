import { NextResponse, NextRequest } from "next/server";
import { db } from "@upcord/db";
import { api } from "@/trpc/server";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid JSON structure" }, { status: 400 });
    }

    console.log("Received webhook body:", body);

    return NextResponse.json({ received: body }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
