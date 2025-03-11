"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

interface Workspace {
  id: string
  name: string
  createdAt: Date
  tenantId: string
  deletedAt: Date | null
}

interface WorkspaceSelectorProps {
  workspaces: Workspace[]
}

export function WorkspaceSelector({ workspaces }: WorkspaceSelectorProps) {
  const router = useRouter()
  const org = authClient.useSession()
  const [open, setOpen] = React.useState(false)
  const [currentWorkspaceId, setCurrentWorkspaceId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (workspaces.length > 0) {
      const defaultWorkspace = workspaces.find((w) => w.tenantId === org.data?.session.activeOrganizationId) ?? workspaces[0]
      if (defaultWorkspace) {
        setCurrentWorkspaceId(defaultWorkspace.id)
      }
    }
  }, [workspaces, org])

  const handleWorkspaceSelect = async(workspaceName: string) => {
    const selectedWorkspace = workspaces.find((workspace) => workspace.name === workspaceName)
    if (selectedWorkspace) {
      setCurrentWorkspaceId(selectedWorkspace.id)
      
      router.push(`/workspace/${selectedWorkspace.id}`)
    }
    setOpen(false)
  }

  const handleCreateWorkspace = () => {
    router.push("/create-workspace")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {currentWorkspaceId ? workspaces.find((w) => w.id === currentWorkspaceId)?.name : "Select workspace"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search workspace" />
          <CommandList>
            {workspaces.length === 0 ? (
              <CommandEmpty>No workspace found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {workspaces.map((workspace) => (
                  <CommandItem key={workspace.id} value={workspace.name} onSelect={handleWorkspaceSelect}>
                    <Check
                      className={cn("mr-2 h-4 w-4", currentWorkspaceId === workspace.id ? "opacity-100" : "opacity-0")}
                    />
                    {workspace.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        <div className="border-t border-border p-2 flex items-center justify-center">
          <Button onClick={handleCreateWorkspace} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Workspace
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
