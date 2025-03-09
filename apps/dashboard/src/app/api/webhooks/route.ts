import { NextResponse, NextRequest } from "next/server";

interface WebhookBody {
  OriginalRecipient?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid JSON structure" }, { status: 400 });
    }

    // Type assertion with safety check
    const webhookBody = body as WebhookBody;

    if (!webhookBody.OriginalRecipient || typeof webhookBody.OriginalRecipient !== "string") {
      return NextResponse.json({ error: "Missing or invalid OriginalRecipient" }, { status: 400 });
    }

    // Extract the hash safely
    const hash = webhookBody.OriginalRecipient.split("@")[0];

    console.log("Hash:", hash);

    return NextResponse.json({ received: hash }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
