import { z } from "zod"
import { TRPCauth, t } from "@/server/api/trpc"
import { db, schema } from "@/server/db"
import { eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

export const update = t.procedure
    .use(TRPCauth)
    .input(z.object({
        name: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
        const userId = ctx.session?.user.id

        if (!userId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Not authenticated"
            })
        }

        await db.update(schema.user)
            .set({
                name: input.name,
                updatedAt: new Date()
            })
            .where(eq(schema.user.id, userId))

        return { success: true }
    })
