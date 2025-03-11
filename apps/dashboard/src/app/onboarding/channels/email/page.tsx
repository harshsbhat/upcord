import { db } from "@upcord/db";
import Client from "./client";
import { getTenant } from "@/lib/getTenant";
import { type DNSRecord } from "./client";
import { redirect } from "next/navigation";

export default async function Email() {
    const tenantId = await getTenant()

    const workspace = await db.query.workspaces.findFirst({
        where: (table, { and, eq, isNull }) =>
          and(eq(table.tenantId, tenantId), isNull(table.deletedAt)),
      });
    const workspaceId = workspace?.id
    const postmark = await db.query.postmark.findFirst({
        where: (table, { and, eq, isNull }) =>
            and(eq(table.workspaceId, workspaceId!), isNull(table.deletedAt)),
    })

    const domain = await db.query.domains.findFirst({
        where: (table, {and, eq, isNull}) =>
            and(eq(table.workspaceId, workspaceId!), isNull(table.deletedAt))
    })

    const hash = postmark?.inboundHash;
    const hashEmail = `${hash}@inbound.postmarkapp.com`;
    return (
        <Client hashEmail={hashEmail} />
    );
  }
  