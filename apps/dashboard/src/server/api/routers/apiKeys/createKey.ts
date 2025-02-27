import { z } from "zod";
import { TRPCauth, t } from "@/server/api/trpc";
import { env } from "@/env";
import { unkey } from "@/lib/unkey";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@/server/db";

const nameSchema = z.object({
    name: z.string()
  });

export const createApiKey = t.procedure
    .use(TRPCauth)
    .input(nameSchema)
    .mutation(async ({ ctx, input }) => {
        const workspaceId = ctx.workspaceId
        const created = await unkey.keys.create({
            apiId: env.UNKEY_API_ID,
            prefix:"upcord",
            byteLength:16,
            ownerId: workspaceId,
            enabled: true
        })

        if (!created.result){
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "We were not able to create a new key"
            })
        }
        await db.transaction(async (tx) => {
            await tx.insert(schema.apiKeys).values({
                id: created.result.keyId,
                name: input.name,
                workspaceId: workspaceId, 
                createdAt: new Date(),
            });
        })
        .catch(() => {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "We are not able to insert a new key"
            })
        })

        return { 
            keyId: created.result.keyId,
            key: created.result.key
        }
})
