"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function Onboarding() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Welcome Onboard!</CardTitle>
          <CardDescription>Let us get you set up</CardDescription>
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

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        description: "Organization created successfully!",
      })

      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to create organization. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleCreateOrganization} className="space-y-4">
      <Input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Enter your name"
        className="w-full"
      />

      <div className="space-y-3">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating
            </>
          ) : (
            "Create Organization"
          )}
        </Button>
        <div>
        <Link href="/threads" className="text-neutral-600 text-sm">
          Skip if you want to join other workspace.
        </Link>
        </div>
      </div>
    </form>
  )
}
