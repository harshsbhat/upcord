import { newId } from "@/lib/id";
import { db, schema } from "@upcord/db";
import { error } from "console";
import { NextResponse, NextRequest } from "next/server";
import { title } from "process";

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
      return NextResponse.json({ error: "Invalid JSON structure" }, { status: 400 });
    }

    const webhookBody = body as WebhookBody;

    if (!webhookBody.OriginalRecipient || typeof webhookBody.OriginalRecipient !== "string") {
      console.error("Missing or invalid OriginalRecipient")
      return NextResponse.json({ error: "Missing or invalid OriginalRecipient" }, { status: 400 });
    }

    const hash = webhookBody.OriginalRecipient.split("@")[0];
    if (!hash){
        console.error("No hash")
        return NextResponse.json({ error: "No Hash found" }, { status: 400 });
    }
    const postmark = await db.query.postmark.findFirst({
        where: (table, { and, eq, isNull }) =>
            and(eq(table.inboundHash, hash), isNull(table.deletedAt)),
    })

    const workspaceId = postmark?.workspaceId

    if (!workspaceId){
        console.error("No workspace")
        return NextResponse.json({ error: "We were not able to find your workspace" }, { status: 400 });
    }

    const threadId = newId("thread")
    const htmlBody = webhookBody.HtmlBody;
    const textBody = webhookBody.TextBody;
    const subject = webhookBody.Subject;
    const From = webhookBody.From

    await db.insert(schema.threads).values({
        id: threadId,
        workspaceId: workspaceId,
        title: subject ?? "No subject",
        description: textBody ?? "No body",
        createdBy: From,
      })
      .catch(() => {
         console.log(From)
      })
    

    return NextResponse.json({ received: hash }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
