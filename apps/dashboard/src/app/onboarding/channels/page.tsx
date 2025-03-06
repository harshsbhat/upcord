"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ChannelSetupForm() {
  const [loading, setLoading] = useState(false)
  const [channels, setChannels] = useState({
    email: false,
    slack: false,
    customForms: false,
  })

  const handleToggle = (channel: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [channel]: !prev[channel] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Channels have been set up!")
    } catch (error) {
      toast.error("Failed to save channels. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Set up your channels</CardTitle>
          <CardDescription>Choose where you want to receive notifications.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {["email", "slack", "customForms"].map((channel) => (
              <div key={channel} className="flex items-center justify-between">
                <Label htmlFor={channel} className="capitalize">
                  {channel === "customForms" ? "Custom Forms" : channel}
                </Label>
                <Switch id={channel} checked={channels[channel as keyof typeof channels]} onCheckedChange={() => handleToggle(channel as keyof typeof channels)} />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <a href="/" className="text-sm text-muted-foreground hover:underline text-center">
              Skip setup
            </a>
            <ShimmerButton className="w-full h-10 bg-gradient-to-r from-primary to-primary/80" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                </span>
              ) : (
                <span className="font-medium text-primary-foreground">Continue</span>
              )}
            </ShimmerButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
