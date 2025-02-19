"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { organization } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function OrganizationOnboarding() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Organization Onboarding</CardTitle>
          <CardDescription>Create your organization to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  )
}

function OnboardingForm() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generateSlug = (name: string) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    return `${name.toLowerCase().replace(/\s+/g, "-")}-${timestamp}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)

    try {
      await organization.create({
        name,
        slug: generateSlug(name),
        logo: "",
      })

      toast({
        description: "Organization created successfully!",
      })

      setTimeout(() => {
        window.location.href = "/threads"
      }, 1000) // Delay for better UX
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to create organization. Contact harsh121102@gmail.com.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Enter organization name"
        className="w-full"
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          "Create Organization"
        )}
      </Button>
    </form>
  )
}
