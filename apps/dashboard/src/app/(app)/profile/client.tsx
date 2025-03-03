"use client"

import { useState } from "react"
import { User, MoreVertical } from "lucide-react"
import { api } from "@/trpc/react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProfileClientProps {
  initialUser: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [username, setUsername] = useState(initialUser.name)
  const [secondaryEmail, setSecondaryEmail] = useState("")
  const { toast } = useToast()

  const updateProfile = api.user.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate({ name: username })
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 2MB",
        variant: "destructive",
      })
      return
    }

    // TODO: Implement avatar upload mutation
  }

  return (
    <div className="container max-w-2xl mx-auto py-16 space-y-8">
      {/* Username Section */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Username</h2>
        <form onSubmit={handleUsernameSubmit} className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Update or create a username
          </label>
          <div className="flex gap-2">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
            <Button 
              type="submit"
              disabled={updateProfile.isPending}
            >
              Save
            </Button>
          </div>
        </form>
      </div>

      {/* Email Section */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Email Addresses</h2>
        <div className="space-y-4">
          {/* Primary Email */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p>{initialUser.email}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  Primary
                </span>
                <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                  Verified
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Secondary Email Input */}
          <div className="flex gap-2">
            <Input
              type="email"
              value={secondaryEmail}
              onChange={(e) => setSecondaryEmail(e.target.value)}
              placeholder="Add another email address"
            />
            <Button>Save</Button>
          </div>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Avatar</h2>
        <div className="flex items-center gap-6">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".png,.jpg,.jpeg"
              onChange={handleAvatarUpload}
            />
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              {initialUser.image ? (
                <img
                  src={initialUser.image}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
          </label>
          <div className="text-sm text-muted-foreground">
            <p>Click on the avatar to upload a custom one from your files.</p>
            <p className="mt-1">Square image recommended. Max size of 2MB.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
