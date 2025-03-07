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
import { api } from "@/trpc/react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function InviteTab() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [openInviteRole, setOpenInviteRole] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const { toast } = useToast()

  const { data: invitationList, isLoading, error, refetch } = api.workspace.getInvitations.useQuery()

  const handleSendInvite = async () => {
    setIsInviting(true)
    try {
      await authClient.organization.inviteMember({
        email: email,
        role: role,
      })
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      })
      setEmail("")
      await refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsInviting(false)
    }
  }

  const handleResendInvite = async (email: string, role: string | null) => {
    try {
      await authClient.organization.inviteMember({
        email: email,
        role: role!
      })
      toast({
        title: "Invitation resent",
        description: "The invitation has been resent successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend invitation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await authClient.organization.cancelInvitation({ invitationId: inviteId })
      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled successfully.",
      })
      await refetch() // Refresh the invitation list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const calculateDaysAgo = (expiresAt: Date | string) => {
    const expiryDate = expiresAt instanceof Date ? expiresAt : new Date(expiresAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - expiryDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading invitations...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Error loading invitations. Please try again later.</p>
        </CardContent>
      </Card>
    )
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
                          value="owner"
                          onSelect={() => {
                            setRole("owner")
                            setOpenInviteRole(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", role === "owner" ? "opacity-100" : "opacity-0")} />
                          Owner
                        </CommandItem>
                        <CommandItem
                          value="admin"
                          onSelect={() => {
                            setRole("admin")
                            setOpenInviteRole(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", role === "admin" ? "opacity-100" : "opacity-0")} />
                          Admin
                        </CommandItem>
                        <CommandItem
                          value="support"
                          onSelect={() => {
                            setRole("support")
                            setOpenInviteRole(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", role === "support" ? "opacity-100" : "opacity-0")} />
                          Support Agent
                        </CommandItem>
                        <CommandItem
                          value="viewer"
                          onSelect={() => {
                            setRole("viewer")
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
            <Button className="w-full sm:w-auto" onClick={handleSendInvite} disabled={isInviting}>
              {isInviting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" /> Send Invitation
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-sm font-medium mb-4">Pending Invitations</h3>
          <div className="space-y-3">
            {(invitationList?.invitations ?? []).length > 0 ? (
              (invitationList?.invitations ?? []).map((invitation) => {
                const daysAgo = calculateDaysAgo(invitation.expiresAt)
                return (
                  <div key={invitation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Invited as {invitation.role ?? "Member"} • {daysAgo} {daysAgo === 1 ? "day" : "days"} ago
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleResendInvite(invitation.email, invitation.role)}
                      >
                        Resend
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive"
                        onClick={() => handleCancelInvite(invitation.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground">No pending invitations</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

