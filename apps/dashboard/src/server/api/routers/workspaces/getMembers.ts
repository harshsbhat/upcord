import { TRPCauth, t } from "@/server/api/trpc";
import { db } from "@upcord/db";
import { TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

export const getMembers = t.procedure
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

        const members = await db.query.member.findMany({
            where: (table, { eq }) => eq(table.organizationId, orgId),
          });
          
        
    
        if(!members){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "We were not able to find any invitaions"
            })
        }

        const userIds = members.map((member) => member.userId);
          
        const users = await db.query.user.findMany({
            where: (table, { inArray }) => inArray(table.id, userIds),
            columns: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          });
          
          const usersWithRoles = users.map((user) => {
            const member = members.find((m) => m.userId === user.id);
            return {
              memberId: member?.id,
              userId: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: member?.role ?? "Unknown",
            };
          });
          
          return {
            users: usersWithRoles,
          };
    })