"use client"

import { useState, useEffect } from "react"
import { User, Mail, CheckCircle, XCircle, LogOut, Loader2, Upload, MoreVertical, Copy, Send } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useUploadThing } from "@/lib/uploadthing-client"
import { toast } from "@/hooks/use-toast"
import { api } from "@/trpc/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ProfilePage() {
  const session = useSession()
  const user = session.data?.user
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const utils = api.useUtils()

  // Initialize state with user data when it's available
  useEffect(() => {
    if (user) {
      setUsername(user.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  const updateUser = api.user.update.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      await utils.invalidate()
      if (session.refresh) {
        await session.refresh()
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    },
  })

  const { startUpload } = useUploadThing("imageUploader")

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/auth/login"
          },
        },
      })
    } catch (error) {
      console.error("Logout failed:", error)
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleEmailActions = async (action: 'copy' | 'resend' | 'make-primary' | 'remove') => {
    switch (action) {
      case 'copy':
        if (user?.email) {
          await navigator.clipboard.writeText(user.email);
          toast({
            title: "Copied!",
            description: "Email address copied to clipboard",
          });
        }
        break;
      
      case 'resend':
        if (!user?.emailVerified) {
          await api.user.resendVerification.mutateAsync();
        }
        break;

      case 'make-primary':
        // This would be relevant if we supported multiple emails
        toast({
          title: "Info",
          description: "This is already your primary email",
        });
        break;

      case 'remove':
        toast({
          title: "Info",
          description: "Cannot remove primary email address",
          variant: "destructive",
        });
        break;
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 2MB",
        variant: "destructive",
      })
      return
    }

    try {
      const uploadResponse = await startUpload([file])
      console.log("Upload response:", uploadResponse) // Debug log

      if (!uploadResponse?.[0]?.url) {
        throw new Error("Failed to get upload URL")
      }

      await updateUser.mutateAsync({
        image: uploadResponse[0].url,
      })

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      })

      if (session.refresh) {
        await session.refresh()
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to update avatar",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (type: 'username' | 'email') => {
    try {
      await updateUser.mutateAsync({
        [type === 'username' ? 'name' : 'email']: 
          type === 'username' ? username : email,
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="container mx-auto p-6 w-3/4">
          <h1 className="mb-8 text-2xl font-bold">Profile Settings</h1>
          
          {/* Username Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Username</h2>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <User className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  placeholder="Your username"
                />
              </div>
              <Button 
                onClick={() => handleSave('username')}
                disabled={updateUser.isLoading}
              >
                {updateUser.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>

          {/* Email Addresses Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Email Addresses</h2>
            <div className="space-y-4">
              {/* Current Email Display */}
              {user?.email && (
                <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.emailVerified 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700 cursor-pointer'
                        }`}
                        onClick={() => !user.emailVerified && handleEmailActions('resend')}
                        >
                          {user.emailVerified ? 'Verified' : 'Click to Verify'}
                        </span>
                        <span className="text-xs text-muted-foreground">Primary</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEmailActions('copy')}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Email
                      </DropdownMenuItem>
                      {!user.emailVerified && (
                        <DropdownMenuItem onClick={() => handleEmailActions('resend')}>
                          <Send className="mr-2 h-4 w-4" />
                          Resend Verification
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {/* Email Update Form */}
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    placeholder="Add email address"
                  />
                </div>
                <Button 
                  onClick={() => handleSave('email')}
                  disabled={updateUser.isLoading}
                >
                  {updateUser.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Your Avatar</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Click on the avatar to upload a custom one from your files.
              Square image recommended. Accepted file types: .png, .jpg. Max file size: 2MB.
            </p>
            <div className="flex justify-center">
              <div className="relative h-32 w-32 cursor-pointer">
                <img
                  src={user?.image || "/default-avatar.png"}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-red-600">Logout</h2>
                  <p className="text-sm text-muted-foreground">
                    You will be redirected to the login page
                  </p>
                </div>
                <Button 
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}