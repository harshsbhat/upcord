import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { db } from "@upcord/db";
import { getTenant } from "@/lib/getTenant";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const tenantId = await getTenant()
  const session = await auth.api.getSession({
      headers: await headers()
    })
  const orgList =  await auth.api.listOrganizations({
    headers: await headers()
  })
  const orgIds = orgList.map((org) => org.id);
  const userId  = session?.user.id

  const workspaceList = await db.query.workspaces.findMany({
    where: (table, { and, inArray, eq, isNull }) =>
      and(
        inArray(table.tenantId, [...orgIds, userId!]),
        isNull(table.deletedAt)
      ),
  });
  console.table(workspaceList)
  
  return (
    <SidebarProvider>
      <AppSidebar workspaceList={workspaceList}/>
      <SidebarInset className="flex flex-col">
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
