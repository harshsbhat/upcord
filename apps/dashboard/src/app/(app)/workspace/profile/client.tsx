"use client"

import type React from "react"

import { useState } from "react"
import { User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

interface ProfileClientProps {
  initialUser: {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string | null | undefined
  }
}

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const [username, setUsername] = useState(initialUser.name)
  const [newEmail, setNewEmail] = useState(initialUser.email)
  // const [isVerificationSending, setIsVerificationSending] = useState(false)
  const { toast } = useToast()

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authClient.updateUser({ name: username })
      toast({
        title: "Success",
        description: "Username updated successfully",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update username",
        variant: "destructive",
      })
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authClient.changeEmail({
        newEmail: newEmail,
        callbackURL: "/profile",
      })
      toast({
        title: "Success",
        description: "Email updated successfully",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update email",
        variant: "destructive",
      })
    }
  }

  // const handleVerificationRequest = async () => {
  //   setIsVerificationSending(true)
  //   try {
  //     const { data, error } = await authClient.emailOtp.verifyEmail({
  //         email: newEmail,
  //         otp: "13456"
  //     })
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to send verification email",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     toast({
  //       title: "Verification Email Sent",
  //       description: "Please check your inbox and follow the link to verify your email",
  //     })
  //     setIsVerificationSending(false)
  //   }
  // }

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
    <div className="container w-3/4 mx-auto py-16 space-y-8">
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Username</h2>
        <form onSubmit={handleUsernameSubmit} className="space-y-2">
          <label className="text-sm text-muted-foreground">Update or create a username</label>
          <div className="flex gap-2">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>

      {/* Email Section */}
      <div className="border rounded-lg p-6">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold mb-4">Email Addresses</h2>
          <Badge variant={initialUser.emailVerified ? "success" : "destructive"}>
            {initialUser.emailVerified ? "Verified" : "Not Verified"}
          </Badge>
        </div>
        <div className="space-y-4">
          <form onSubmit={handleEmailSubmit} className="space-y-2">
            <label className="text-sm text-muted-foreground">Update email address</label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email"
              />
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Email Verification Section
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Email Verification</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{initialUser.email}</p>
              <p className="text-sm text-muted-foreground">
                {initialUser.emailVerified
                  ? "Your email is verified"
                  : "Your email is not verified. Please verify to access all features."}
              </p>
            </div>
          </div>

          {!initialUser.emailVerified && (
            <div>
              <Button onClick={handleVerificationRequest} disabled={isVerificationSending} className="w-full sm:w-auto">
                {isVerificationSending ? "Sending..." : "Send Verification Email"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Did receive the email? Check your spam folder or request a new verification email.
              </p>
            </div>
          )}
        </div>
      </div> */}

      {/* Avatar Section */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Avatar</h2>
        <div className="flex items-center gap-6">
          <label className="cursor-pointer">
            <input type="file" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleAvatarUpload} />
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              {initialUser.image ? (
                <img
                  src={initialUser.image || "/placeholder.svg"}
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