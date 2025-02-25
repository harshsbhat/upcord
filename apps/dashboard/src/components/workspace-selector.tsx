"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { useListOrganizations } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function WorkspaceSelector() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const workspaceList = useListOrganizations()

  const workspaces = workspaceList.data ?? []

  const handleCreateWorkspace = () => {
    window.location.href = "/create-workspace"
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? workspaces.find((workspace) => workspace.name === value)?.name : "Select workspace"}
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
                  <CommandItem
                    key={workspace.id}
                    value={workspace.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === workspace.name ? "opacity-100" : "opacity-0")} />
                    {workspace.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        <div className="border-t border-gray-200 p-2 flex items-center justify-center">
          <Button onClick={handleCreateWorkspace} className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Workspace
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
