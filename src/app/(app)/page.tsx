import { redirect } from "next/navigation"
import { getTennant } from "@/lib/getTennant"
import { db, schema } from "@/server/db"
import { newId } from "@/lib/id"


export default async function Home() {
  const { userId } = await getTennant()
  const personalWorkspace = await db.query.workspaces.findFirst({
    where: (table, { and, eq, isNull }) =>
      and(eq(table.tenantId, userId!), isNull(table.deletedAt)),
  });

  if(!personalWorkspace){
    const workspaceId = newId("workspace");
    await db.insert(schema.workspaces).values({
      id: workspaceId,
      name: "Personal",
      tenantId: userId!,
      createdAt: new Date(),
    });
  }
 }