"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, ChevronsUpDown, Search, Trash2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function MembersTab() {
  const [roleFilter, setRoleFilter] = useState("all")
  const [openRoleFilter, setOpenRoleFilter] = useState(false)
  const [currentMemberRole, setCurrentMemberRole] = useState({})

  const members = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sam Wilson",
      email: "sam@example.com",
      role: "Editor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Taylor Kim",
      email: "taylor@example.com",
      role: "Viewer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Jordan Lee",
      email: "jordan@example.com",
      role: "Editor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Casey Smith",
      email: "casey@example.com",
      role: "Viewer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const handleMemberRoleChange = () => {
    console.log("Member change")
  }

  const handleRoleFilterChange = () => {
    console.log("Role Filter:")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search members..." className="w-full pl-8" />
          </div>
          <Popover open={openRoleFilter} onOpenChange={setOpenRoleFilter}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openRoleFilter}
                className="w-[180px] justify-between"
              >
                {roleFilter === "all"
                  ? "All Roles"
                  : roleFilter === "admin"
                    ? "Admin"
                    : roleFilter === "editor"
                      ? "Editor"
                      : "Viewer"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0">
              <Command>
                <CommandInput placeholder="Search role..." />
                <CommandList>
                  <CommandEmpty>No role found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        handleRoleFilterChange()
                        setOpenRoleFilter(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", roleFilter === "all" ? "opacity-100" : "opacity-0")} />
                      All Roles
                    </CommandItem>
                    <CommandItem
                      value="admin"
                      onSelect={() => {
                        handleRoleFilterChange()
                        setOpenRoleFilter(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", roleFilter === "admin" ? "opacity-100" : "opacity-0")} />
                      Admin
                    </CommandItem>
                    <CommandItem
                      value="editor"
                      onSelect={() => {
                        handleRoleFilterChange()
                        setOpenRoleFilter(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", roleFilter === "editor" ? "opacity-100" : "opacity-0")} />
                      Editor
                    </CommandItem>
                    <CommandItem
                      value="viewer"
                      onSelect={() => {
                        handleRoleFilterChange()
                        setOpenRoleFilter(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", roleFilter === "viewer" ? "opacity-100" : "opacity-0")} />
                      Viewer
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-[130px] justify-between">
                          {member.role}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[130px] p-0">
                        <Command>
                          <CommandInput placeholder="Search role..." />
                          <CommandList>
                            <CommandEmpty>No role found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem value="Admin" onSelect={() => console.log("harsh")}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    (member.role) === "Admin"
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                Admin
                              </CommandItem>
                              <CommandItem value="Editor" onSelect={() => handleMemberRoleChange()}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    (member.role) === "Editor"
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                Editor
                              </CommandItem>
                              <CommandItem value="Viewer" onSelect={() => handleMemberRoleChange()}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    (member.role) === "Viewer"
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                Viewer
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

