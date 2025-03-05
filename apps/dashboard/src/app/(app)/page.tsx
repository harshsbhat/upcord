import { redirect } from "next/navigation"
import { getTenant } from "@/lib/getTenant"
import { db, schema } from "@upcord/db"
import { newId } from "@/lib/id"
export default async function Home() {
    const userId = await getTenant()
    const personalWorkspace = await db.query.workspaces.findFirst({
      where: (table, { and, eq, isNull }) =>
        and(eq(table.tenantId, userId), isNull(table.deletedAt)),
    });

    if (!personalWorkspace) {
      const workspaceId = newId("workspace");
      await db.insert(schema.workspaces).values({
        id: workspaceId,
        name: "Personal",
        tenantId: userId,
        createdAt: new Date(),
      });
    }

    redirect("/cords")
}
