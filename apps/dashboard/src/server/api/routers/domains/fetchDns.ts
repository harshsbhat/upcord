import { TRPCauth, t } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@upcord/db";


export const fetchDns = t.procedure
    .use(TRPCauth)
    .query(async ({ ctx }) => {
      const workspaceId = ctx.workspace?.id;
      if (!workspaceId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Workspace ID is missing.",
        });
      }
      const domain = await db.query.domains.findFirst({
        where: (table, {eq, isNull, and}) =>
          and(eq(table.workspaceId, workspaceId), isNull(table.deletedAt))
      })

      if(!domain){
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Domain not found.",
        });
      }
      if(!domain.dnsRecords){
        return {
          dnsRecords: [],
          verified: false,
        }
      }
      return {
        dnsRecords: JSON.parse(domain.dnsRecords),
        verified: domain.verified,
      }
  });
