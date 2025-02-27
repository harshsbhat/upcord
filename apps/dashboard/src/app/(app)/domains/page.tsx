import { getTenant } from "@/lib/getTenant"
import { db } from "@upcord/db"
import { redirect } from "next/navigation"
import Client from "./client"

export default async function Domains() {
  const tenantId = await getTenant()
  const workspace = await db.query.workspaces.findFirst({
    where: (table, { and, eq, isNull }) => and(eq(table.tenantId, tenantId), isNull(table.deletedAt)),
  })

  const workspaceId = workspace?.id
  const domains = await db.query.domains.findMany({
    where: (table, { and, eq, isNull }) => and(eq(table.workspaceId, workspaceId!), isNull(table.deletedAt)),
  })

  if (domains.length === 0) {
    return redirect("/domains/add")
  }

  return <Client domains={domains} />
}
