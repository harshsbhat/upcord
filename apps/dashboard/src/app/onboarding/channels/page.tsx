"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Slack, FormInput } from "lucide-react"
import { ShineBorder } from "@/components/magicui/shine-border";

export default function ChannelsPage() {
  const channels = [
    {
      name: "Email",
      description: "Set up email forwarding to receive customer emails",
      icon: Mail,
      href: "/onboarding/channels/email"
    },
    {
      name: "Slack", 
      description: "Connect Slack to get notifications in your workspace",
      icon: Slack,
      href: "/onboarding/channels/slack"
    },
    {
      name: "Custom Forms",
      description: "Create custom forms to collect information",
      icon: FormInput,
      href: "/onboarding/channels/forms"
    }
  ]

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl relative overflow-hidden">
      <ShineBorder shineColor={"black"} />
        <CardHeader>
          <CardTitle className="text-xl">Set up your channels</CardTitle>
          <CardDescription>Choose which channels you want to set up</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <Card 
              key={channel.name}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => window.location.href = channel.href}
            >
              <CardHeader>
                <channel.icon className="h-6 w-6 mb-2" />
                <CardTitle className="text-lg">{channel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{channel.description}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
