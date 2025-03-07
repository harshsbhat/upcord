import { TRPCauth, t } from "@/server/api/trpc";
import { db } from "@upcord/db";
import { TRPCError } from "@trpc/server";

export const getInvitations = t.procedure
    .use(TRPCauth)
    .query(async ({ ctx }) => {
        if (!ctx.session?.session){
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "We were not able to find your session please contact harsh"
            })
        }
        const orgId = ctx.session.session.activeOrganizationId

        if(!orgId){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "We were not able to find any invitaions"
            })
        }

        const invitations = await db.query.invitation.findMany({
            where: (table, { eq, ne }) => 
              eq(table.organizationId, orgId) && ne(table.status, "canceled")
          });

        if(!invitations){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "We were not able to find any invitaions"
            })
        }
        return ({
            invitations,
        })
    })