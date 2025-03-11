import { z } from "zod";
import { TRPCauth, t } from "@/server/api/trpc";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@upcord/db";
import { newId } from "@/lib/id";

const workspaceSchema = z.object({
  workspaceId: z.string(),
});


export const createWorkspace = t.procedure
  .use(TRPCauth)
  .input(workspaceSchema)
  .mutation(async ({ input }) => {
    const workspaceId = newId("workspace"); 

    return { workspaceId };
    
  });
