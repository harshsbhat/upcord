import type { LucideIcon } from "lucide-react"

import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"

interface NavItemProps {
  icon: LucideIcon
  label: string
  href: string
}

export function NavItem({ icon: Icon, label, href }: NavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href={href} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

