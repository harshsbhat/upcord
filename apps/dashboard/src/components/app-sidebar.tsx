import {
    Archive,
    Cable,
    CheckCircle,
    Clock,
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
  
  interface Workspace {
    id: string;
    name: string;
    createdAt: Date;
    tenantId: string;
    deletedAt: Date | null;
  }
  
  interface WorkspaceListProps {
    workspaceList: Workspace[];
  }
  
  export function AppSidebar({ workspaceList }: WorkspaceListProps) {
    return (
      <Sidebar>
        <SidebarHeader>
          <WorkspaceSelector workspaces={workspaceList}/>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Cords</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem icon={Inbox} label="All cords" href="/cords" />
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
            <NavItem icon={Cable} label="Channels" href="/channels" />
            <NavItem icon={Settings} label="Settings" href="#settings" />
          </SidebarMenu>
          <SidebarSeparator />
          <UserNav />
        </SidebarFooter>
      </Sidebar>
    )
  }
  
  