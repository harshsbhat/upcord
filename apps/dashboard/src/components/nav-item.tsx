import type { LucideIcon } from "lucide-react"

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import Link from "next/link"

interface NavItemProps {
  icon: LucideIcon
  label: string
  href: string
}

export function NavItem({ icon: Icon, label, href }: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={href} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

