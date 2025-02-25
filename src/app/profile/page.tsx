"use client"

import { useState } from "react"
import { User, Mail, CheckCircle, XCircle, LogOut, Loader2, Upload, MoreVertical } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  const session = useSession()
  const user = session.data?.user
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [username, setUsername] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

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
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.size <= 2 * 1024 * 1024) { // 2MB limit
      setAvatarFile(file)
    } else {
      alert("Please select an image under 2MB")
    }
  }

  const handleSave = async (type: 'username' | 'email') => {
    setIsUpdating(true)
    try {
      console.log(`Updating ${type}:`, type === 'username' ? username : email)
    } catch (error) {
      console.error(`Failed to update ${type}:`, error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 p-8">
          {/* Username Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Username</h2>
                <Label className="text-base font-medium mb-2">Username</Label>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Update or create a username
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleSave('username')} 
                    disabled={isUpdating}
                    className="bg-zinc-900 text-white hover:bg-zinc-800"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Email Addresses</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_100px_100px_80px] items-center text-sm font-medium gap-4">
                  <div>Email</div>
                  <div>Primary</div>
                  <div>Status</div>
                  <div className="text-right">Settings</div>
                </div>
                <div className="grid grid-cols-[1fr_100px_100px_80px] items-center gap-4">
                  <div className="truncate">{email}</div>
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-zinc-100">
                      Primary
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-zinc-100">
                      Verified
                    </span>
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center gap-4">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Add an email address"
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSave('email')} 
                  disabled={isUpdating}
                  className="bg-zinc-900 text-white hover:bg-zinc-800"
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Avatar Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">Your Avatar</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click on the avatar to upload a custom one from your files.<br />
                    Square image recommended. Accepted file types: .png, .jpg. Max file size: 2MB.
                  </p>
                </div>
                <div 
                  className="cursor-pointer"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-full"
                      unoptimized
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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