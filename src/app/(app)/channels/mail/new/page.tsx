"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DomainInput from "./domainName"

export default function DomainSetup() {
  const [setupType, setSetupType] = useState<"sending" | "forwarding" | null>(null)

  if (setupType) {
    return <DomainInput />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Domain Email Setup</h1>
        <p className="text-gray-600 mt-2">Choose how you want to configure your domain for email usage.</p>
      </div>

      {/* Cards */}
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Setup Sending Emails</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Configure DNS records to send emails from your domain.</p>
          <Button className="mt-4 w-full" onClick={() => setSetupType("sending")}>
            Get Started
          </Button>
        </CardContent>
      </Card>

      <Card className="w-96">
        <CardHeader>
          <CardTitle>Setup Email Forwarding</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Set up email forwarding to receive emails in your inbox.</p>
          <Button className="mt-4 w-full" onClick={() => setSetupType("forwarding")}>
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
