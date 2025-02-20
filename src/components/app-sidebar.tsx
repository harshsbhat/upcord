import {
    Archive,
    CheckCircle,
    Clock,
    Folder,
    Inbox,
    LayoutGrid,
    MessageCircle,
    PauseCircle,
    Search,
    Settings,
    User,
  } from "lucide-react"
  
  import { NavItem } from "./nav-item"
  import { UserNav } from "./user-nav"
  import { WorkspaceSelector } from "./workspace-selector"
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarSeparator,
  } from "@/components/ui/sidebar"
  
  export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarHeader>
          <WorkspaceSelector />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Cords</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem icon={Inbox} label="All cords" href="#all-cords" />
                <NavItem icon={User} label="Your cords" href="#your-cords" />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Tasks</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem icon={MessageCircle} label="Need Response" href="#need-response" />
                <NavItem icon={Search} label="Examining" href="#examining" />
                <NavItem icon={CheckCircle} label="Resolve Query" href="#resolve-query" />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Waiting</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem icon={Clock} label="Waiting Response" href="#waiting-response" />
                <NavItem icon={PauseCircle} label="Paused" href="#paused" />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Resolved</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem icon={Archive} label="Resolved" href="#resolved" />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <NavItem icon={LayoutGrid} label="Browse" href="#browse" />
            <NavItem icon={Folder} label="Projects" href="#projects" />
            <NavItem icon={Settings} label="Settings" href="#settings" />
          </SidebarMenu>
          <SidebarSeparator />
          <UserNav />
        </SidebarFooter>
      </Sidebar>
    )
  }
  
  