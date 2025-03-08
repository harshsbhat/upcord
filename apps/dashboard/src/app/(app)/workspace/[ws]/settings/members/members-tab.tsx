"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, ChevronsUpDown, Loader2, Search, Trash2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"
import { useToast } from "@/hooks/use-toast"
import { authClient } from "@/lib/auth-client"

export default function MembersTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [openRoleFilter, setOpenRoleFilter] = useState(false)
  const { toast } = useToast()

  const { data: memberList, isLoading, error, refetch, isRefetching } = api.workspace.getMembers.useQuery()

  const handleMemberRoleChange = (memberId: string, newRole: string) => {
    console.log(memberId, newRole)
  }

  const handleRemoveMember = async(memberId: string) => {
    await authClient.organization.removeMember({
      memberIdOrEmail: memberId,
      organizationId: "organization-id" 
  })
  }

  const filteredMembers =
    memberList?.users.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ??
        member.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = ["all", member.role.toLowerCase()].includes(roleFilter.toLowerCase());


      return matchesSearch && matchesRole
    }) ?? []


  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="w-full max-w-sm h-10 bg-muted rounded animate-pulse"></div>
            <div className="w-[180px] h-10 bg-muted rounded animate-pulse"></div>
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
              {[...Array<number>(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                          <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-[130px] h-10 bg-muted rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="ml-auto w-8 h-8 bg-muted rounded animate-pulse"></div>
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

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-red-500">Error loading members. Please try again later.</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Popover open={openRoleFilter} onOpenChange={setOpenRoleFilter}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openRoleFilter}
                className="w-[180px] justify-between"
              >
                {roleFilter === "all" ? "All Roles" : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
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
                        setRoleFilter("all")
                        setOpenRoleFilter(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", roleFilter === "all" ? "opacity-100" : "opacity-0")} />
                      All Roles
                    </CommandItem>
                    <CommandItem
                      value="admin"
                      onSelect={() => {
                        setRoleFilter("admin")
                        setOpenRoleFilter(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", roleFilter === "admin" ? "opacity-100" : "opacity-0")} />
                      Admin
                    </CommandItem>
                    <CommandItem
                      value="editor"
                      onSelect={() => {
                        setRoleFilter("editor")
                        setOpenRoleFilter(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", roleFilter === "editor" ? "opacity-100" : "opacity-0")} />
                      Editor
                    </CommandItem>
                    <CommandItem
                      value="viewer"
                      onSelect={() => {
                        setRoleFilter("viewer")
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

        {isRefetching && (
          <div className="flex items-center justify-center mb-4 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Refreshing member list...
          </div>
        )}

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
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.memberId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.image!} alt={member.name} />
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
                                <CommandItem value="Admin" onSelect={() => handleMemberRoleChange(member.memberId!, "Admin")}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      member.role === "Admin" ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  Admin
                                </CommandItem>
                                <CommandItem
                                  value="Editor"
                                  onSelect={() => handleMemberRoleChange(member.memberId!, "Editor")}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      member.role === "Editor" ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  Editor
                                </CommandItem>
                                <CommandItem
                                  value="Viewer"
                                  onSelect={() => handleMemberRoleChange(member.userId, "Viewer")}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      member.role === "Viewer" ? "opacity-100" : "opacity-0",
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleRemoveMember(member.userId)}
                      >
                        {"test" === member.userId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    {searchQuery ?? roleFilter !== "all" ? (
                      <div className="text-muted-foreground">
                        No members found matching your filters.
                        <Button
                          variant="link"
                          className="ml-2"
                          onClick={() => {
                            setSearchQuery("")
                            setRoleFilter("all")
                          }}
                        >
                          Clear filters
                        </Button>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No members in this workspace.</div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

