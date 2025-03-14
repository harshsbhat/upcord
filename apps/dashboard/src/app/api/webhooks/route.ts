import { newId } from "@/lib/id";
import { db, schema } from "@upcord/db";
import { NextResponse, NextRequest } from "next/server";

interface WebhookBody {
  OriginalRecipient?: string;
  HtmlBody?: string;
  TextBody?: string;
  Subject?: string;
  From: string;
}

export async function POST(req: NextRequest) {
  try {

    const body: unknown = await req.json();

    if (typeof body !== "object" || body === null) {
      console.error("Invalid JSON structure:", body);
      return NextResponse.json({ error: "Invalid JSON structure" }, { status: 400 });
    }

    const webhookBody = body as WebhookBody;

    if (!webhookBody.OriginalRecipient || typeof webhookBody.OriginalRecipient !== "string") {
      console.error("Missing or invalid OriginalRecipient:", webhookBody.OriginalRecipient);
      return NextResponse.json({ error: "Missing or invalid OriginalRecipient" }, { status: 400 });
    }

    const hash = webhookBody.OriginalRecipient.split("@")[0];

    if (!hash) {
      console.error("No hash found in OriginalRecipient:", webhookBody.OriginalRecipient);
      return NextResponse.json({ error: "No Hash found" }, { status: 400 });
    }

    let postmark;
    try {
      postmark = await db.query.postmark.findFirst({
        where: (table, { and, eq, isNull }) =>
          and(eq(table.inboundHash, hash), isNull(table.deletedAt)),
      });
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json({ error: "Database query failed" }, { status: 500 });
    }


    if (!postmark) {
      console.error(`No postmark entry found for hash: ${hash}`);
      return NextResponse.json({ error: "No matching postmark entry found" }, { status: 400 });
    }

    const workspaceId = postmark.workspaceId;

    if (!workspaceId) {
      console.error("No workspace found for hash:", hash);
      return NextResponse.json({ error: "We were not able to find your workspace" }, { status: 400 });
    }

    const threadId = newId("thread");

    const htmlBody = webhookBody.HtmlBody;
    const textBody = webhookBody.TextBody;
    const subject = webhookBody.Subject;
    const From = webhookBody.From;
    
    try {
      await db.insert(schema.threads).values({
        id: threadId,
        workspaceId: workspaceId,
        title: subject ?? "No subject",
        description: textBody ?? "No body",
        createdBy: From,
      });
    } catch (insertError) {
      console.error("Error inserting thread into database:", insertError);
      return NextResponse.json({ error: "Failed to save thread" }, { status: 500 });
    }


    return NextResponse.json({ received: hash }, { status: 200 });

  } catch (error) {
    console.error("Unexpected error processing webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
