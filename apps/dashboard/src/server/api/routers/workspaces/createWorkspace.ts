import { z } from "zod";
import { TRPCauth, t } from "@/server/api/trpc";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@upcord/db";
import { newId } from "@/lib/id";

const workspaceSchema = z.object({
  orgId: z.string(),
  displayName: z.string().min(1, "Display Name is required"),
});

// Define a type-safe schema for Postmark's response
const postmarkResponseSchema = z.object({
  ID: z.string(),
  InboundHash: z.string(),
});

interface PostmarkResponse {
  ID: string,
  InboundHash: string
}

export const createWorkspace = t.procedure
  .use(TRPCauth)
  .input(workspaceSchema)
  .mutation(async ({ input }) => {
    const workspaceId = newId("workspace");
    const postmarkId = newId("postmark");

    await db.transaction(async (tx) => {
    await tx
      .insert(schema.workspaces)
      .values({
        id: workspaceId,
        name: input.displayName,
        tenantId: input.orgId,
        createdAt: new Date(),
      })
      .catch(() => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "We were unable to create your workspace.",
        });
      });

    // Create Postmark server for inbound emails
    const response = await fetch("https://api.postmarkapp.com/servers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Account-Token": env.POSTMARK_ACCOUNT_TOKEN,
      },
      body: JSON.stringify({
        Name: input.displayName,
        InboundHookUrl: "https://upcord.vercel/api/webhooks",
      }),
    });

    if (!response.ok) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create Postmark server.",
      });
    }

    const json = (await response.json()) as PostmarkResponse;

    const { ID, InboundHash } = json; 

  await tx
    .insert(schema.postmark)
    .values({
      id: postmarkId,
      serverId: ID,
      name: input.displayName,
      workspaceId: workspaceId,
      inboundHash: InboundHash,
      createdAt: new Date()
    })
    .catch((error) => {
      console.error(error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "We were not able to create postmark server"
      })
    })
  
  })
    return { workspaceId };
    
  });
