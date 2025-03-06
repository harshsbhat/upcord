import { z } from "zod";
import { TRPCauth, t } from "@/server/api/trpc";
import { Resend } from "resend";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@upcord/db";
import { newId } from "@/lib/id";


const workspaceSchema = z.object({
  orgId: z.string(),
  displayName: z.string().min(1, "Display Name is required"),
})

export const createWorkspace = t.procedure
    .use(TRPCauth)
    .input(workspaceSchema)
    .mutation(async ({ input }) => {
        const workspaceId = newId("workspace");
        await db.insert(schema.workspaces).values({
          id: workspaceId,
          name: input.displayName,
          tenantId: input.orgId,
          createdAt: new Date(),
        });
        return ({
            workspaceId,
        })
    })

