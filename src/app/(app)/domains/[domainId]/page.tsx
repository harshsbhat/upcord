import { db } from "@/server/db";
import { Client } from "./client";
import { getTenant } from "@/lib/getTenant";
import { redirect } from "next/navigation";

export interface DNSRecord {
    record: string;
    name: string;
    type: string;
    ttl: string;
    status: string;
    value: string;
    priority?: number; 
  }
  

export default async function DomainDetails() {
  const tenantId = await getTenant();
  const workspace = await db.query.workspaces.findFirst({
    where: (table, { and, eq, isNull }) =>
      and(eq(table.tenantId, tenantId), isNull(table.deletedAt)),
  });
  const workspaceId = workspace?.id
  const domain = await db.query.domains.findFirst({
    where: (table, { and, eq, isNull }) =>
      and(eq(table.workspaceId, workspaceId!), isNull(table.deletedAt)),
  });

  if (!domain) {
    return redirect("/domains/add");
  }

  const dnsRecords = domain.dnsRecords as unknown as DNSRecord[]; 

  return <Client records={dnsRecords} />;
}
