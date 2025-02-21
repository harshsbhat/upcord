"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SlackIcon, Mail, FileText } from "lucide-react"

interface Channel {
  category: string | null
  connected: boolean | null
}

interface ChannelsPageProps {
  channels: Channel[]
}

export default function ChannelsPage({ channels }: ChannelsPageProps) {
  const router = useRouter()

  const defaultChannels = [
    { name: "Slack", key: "slack", icon: SlackIcon },
    { name: "Email", key: "mail", icon: Mail },
    { name: "Web Forms", key: "forms", icon: FileText },
  ]

  const connectionStatus = defaultChannels.map((defaultChannel) => {
    const matchedChannel = channels.find(
      (channel) => channel.category?.toLowerCase() === defaultChannel.key
    )
    return {
      name: defaultChannel.name,
      key: defaultChannel.key,
      icon: defaultChannel.icon,
      connected: matchedChannel?.connected ?? false,
    }
  })

  const handleConnect = (key: string) => {
    router.push(`/channels/${key}/new`)
  }

  return (
    <div className="container max-w-3xl mx-auto py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold mb-2">Channels</h1>
        <p>Channels are the communication platforms where your support queries are collected and managed.</p>
      </div>

      <div className="space-y-4">
        {connectionStatus.map((channel) => (
          <Card key={channel.name} className="border border-border">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-6">
                <div className="p-2 rounded-md bg-muted">
                  <channel.icon className="h-5 w-5" />
                </div>
                <span className="font-medium">{channel.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      channel.connected ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {channel.connected ? "Connected" : "Not connected"}
                  </span>
                </div>
                <Button
                  variant={channel.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleConnect(channel.key)}
                >
                  {channel.connected ? "Manage" : "Connect"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
