import { z } from "zod";
import { TRPCauth, t } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@upcord/db";
import { eq } from "drizzle-orm";
import { unkey } from "@/lib/unkey";

const keyIdSchema = z.object({
    keyId: z.string()
  });

export const revokeApiKey = t.procedure
    .use(TRPCauth)
    .input(keyIdSchema)
    .mutation(async ({ input }) => {
        await unkey.keys.delete({ keyId: input.keyId })
        .catch(() => {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "We are not able to delete your key"
            })
        })
        await db.transaction(async (tx) => {
            await tx.update(schema.apiKeys).set({
                deletedAt: new Date(),
            })
            .where(eq(schema.apiKeys.id, input.keyId))
        })
        .catch(() => {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "We are not able to delete your key"
            })
        })
})
