"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ChevronsUpDown, Mail } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function InviteTab() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [openInviteRole, setOpenInviteRole] = useState(false)

  const handleSendInvite = async () => {
    await authClient.organization.inviteMember({
      email: email,
      role: role,
    })
  }


  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Invite Team Members</h2>
          <p className="text-muted-foreground">Send invitations to your team members to collaborate on your project.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  className="pl-8"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Popover open={openInviteRole} onOpenChange={setOpenInviteRole}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openInviteRole}
                    className="w-[130px] justify-between"
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[130px] p-0">
                  <Command>
                    <CommandInput placeholder="Search role..." />
                    <CommandList>
                      <CommandEmpty>No role found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="admin"
                          onSelect={() => {
                            setOpenInviteRole(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", role === "admin" ? "opacity-100" : "opacity-0")} />
                          Admin
                        </CommandItem>
                        <CommandItem
                          value="editor"
                          onSelect={() => {
                            setOpenInviteRole(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", role === "editor" ? "opacity-100" : "opacity-0")} />
                          Editor
                        </CommandItem>
                        <CommandItem
                          value="viewer"
                          onSelect={() => {
                            setOpenInviteRole(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", role === "viewer" ? "opacity-100" : "opacity-0")} />
                          Viewer
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full sm:w-auto" onClick={handleSendInvite}>
              <Mail className="mr-2 h-4 w-4" /> Send Invitation
            </Button>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-sm font-medium mb-4">Pending Invitations</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div>
                <p className="font-medium">robin@example.com</p>
                <p className="text-sm text-muted-foreground">Invited as Editor • 2 days ago</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Resend
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive">
                  Cancel
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <div>
                <p className="font-medium">jamie@example.com</p>
                <p className="text-sm text-muted-foreground">Invited as Viewer • 5 days ago</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Resend
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

