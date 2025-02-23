import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { Resend } from "resend";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@/server/db";
import { newId } from "@/lib/id";

const domainSchema = z.object({
  domain: z
    .string()
    .regex(/^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,63}$/, "Invalid domain name"),
});

export const domainsRouter = createTRPCRouter({
  create: privateProcedure
    .input(domainSchema)
    .mutation(async ({ ctx, input }) => {
      const resend = new Resend(env.RESEND_API_KEY);

      const workspaceId = ctx.workspace?.id;
      if (!workspaceId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Workspace ID is missing.",
        });
      }

      const existingDomain = await db.query.domains.findFirst({
        where: (table, { and, eq, isNull }) =>
          and(eq(table.workspaceId, workspaceId), isNull(table.deletedAt)),
      });

      if (existingDomain) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message:
            "We only allow one domain per workspace right now! Please delete the first domain if you want to add this one.",
        });
      }

      const response = await resend.domains
        .create({ name: input.domain })
        .catch((apiError: unknown) => {
          console.error("Resend API Error:", apiError);
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              apiError instanceof Error ? apiError.message : "Failed to create domain via Resend.",
          });
        });

      console.log("Resend Response:", response.data?.records);

      if (!response.data?.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: response.error?.message ?? "We were not able to add your domain.",
        });
      }
      const resendId = response.data?.id
      const result =  await db
        .transaction(async (tx) => {
          const domainId = newId("domain");
          await tx.insert(schema.domains).values({
            id: domainId,
            resendId: resendId,
            name: input.domain,
            workspaceId,
            verified: false,
            dnsRecords: JSON.stringify(response.data?.records),
            createdAt: new Date(),
            deletedAt: null,
          });

          return { 
            id: domainId, 
          };
        })
        .catch((dbError: unknown) => {
          console.error("Database Transaction Error:", dbError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database transaction failed. Please try again later.",
          });
        });
      return result
    }),
});
