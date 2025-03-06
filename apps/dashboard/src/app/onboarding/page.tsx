"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { z } from "zod"
import confetti from "canvas-confetti";
import { api } from "@/trpc/react"
import { redirect } from "next/navigation"

const workspaceSchema = z.object({
  displayName: z.string().min(1, "Display Name is required"),
  internalName: z.string().min(1, "Internal Name is required"),
})

export default function WorkspaceOnboardingForm() {
  const [formData, setFormData] = useState({
    displayName: "",
    internalName: "",
  })
  const [loading, setLoading] = useState(false)
    const createWorkspace = api.workspace.create.useMutation({
      onSuccess: async (data) => {
        toast.success("Workspace has been created")
        triggerConfetti()
        window.location.href = "/"
      },
      onError: (err) => {
        toast.error("Error. We could not create a workspace.")
      }
    });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
 
    const frame = () => {
      if (Date.now() > end) return;
 
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
 
      requestAnimationFrame(frame);
    };
 
    frame();
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = workspaceSchema.safeParse(formData)
    if (!result.success) {
      setLoading(false)
      result.error.errors.forEach((err) => toast.error(err.message))
      return
    }
  
    try {
      const org = await authClient.organization.create({
        name: formData.displayName,
        slug: formData.internalName,
      })
      const orgId = org.data?.id
      createWorkspace.mutate({
        orgId: orgId!,
        displayName: formData.displayName
      })

    } catch (error) {
      toast.error("Failed to create organization. Please try again.")
      console.error("Organization creation error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Create your workspace</CardTitle>
          <CardDescription>Set up your new workspace to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                placeholder="Acme Team"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">This is how your workspace will appear to others</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="internalName">Internal Name</Label>
              <Input
                id="internalName"
                name="internalName"
                placeholder="acme-team"
                value={formData.internalName}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">Used for references and URLs (cannot be changed later)</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-5">
            <ShimmerButton className="w-full h-10 bg-gradient-to-r from-primary to-primary/80" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                </span>
              ) : (
                <span className="font-medium text-primary-foreground">Create Workspace</span>
              )}
            </ShimmerButton>
            <a href="/" className="text-sm text-muted-foreground hover:underline text-center">
            Skip onboarding
          </a>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

