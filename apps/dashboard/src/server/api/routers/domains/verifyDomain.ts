import { TRPCauth, t } from "@/server/api/trpc";
import { Resend } from "resend";
import { env } from "@/env";
import { TRPCError } from "@trpc/server";
import { db, schema } from "@upcord/db";
import { eq } from "drizzle-orm";


export const verifyDomain = t.procedure
.use(TRPCauth)
.mutation(async({ ctx }) => {
  const resend = new Resend(env.RESEND_API_KEY)
  const workspaceId = ctx.workspace?.id
  if (!workspaceId){
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "We were not able to find your workspace. Please contact Harsh"
    })
  }
  const resendId = await db.query.domains.findFirst({
    where: (table, {eq, isNull, and}) =>
      and(eq(table.workspaceId, workspaceId), isNull(table.deletedAt))
  })
  .catch(() => {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "We were not able to find the resend Id. Contact harsh"
    })
  })

  if(!resendId?.resendId){
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Sorry we did not find your resendId"
    })
  }

  const response = await resend.domains
  .get(resendId.resendId)
  .catch(() => {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "RESEND ERROR"
    })
  })
  if (!response.data){
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "RESEND ERROR"
    })
  }

  if(response.data.status === "verified"){
    await db.update(schema.domains)
    .set({verified: true})
    .where(eq(schema.domains.resendId, resendId.resendId))
    .catch(() => {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "We could not update your DNS records"
      })
    })
  }

  const dnsRecords = JSON.stringify(response.data.records)
  await db.update(schema.domains)
  .set({dnsRecords: dnsRecords})
  .where(eq(schema.domains.resendId, resendId.resendId))
  .catch(() => {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "We could not update your DNS records"
    })
  })
});