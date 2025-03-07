import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { db } from "@upcord/db";
import { getTenant } from "@/lib/getTenant";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const tenantId = await getTenant()

  
  return (
    <div>
        {children}
    </div>
  );
}
