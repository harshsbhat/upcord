"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { ShineBorder } from "@/components/magicui/shine-border"
import { Input } from "@/components/ui/input"
import { api } from "@/trpc/react"
import React from "react"
import { toast } from "sonner"
import { DNSRecords } from "./dnsRecords"

export interface DNSRecord {
    record: string;
    name: string;
    type: string;
    ttl: string;
    status: string;
    value: string;
    priority?: number; 
}

interface ClientProps {
    hashEmail: string;
}

export default function Client({ hashEmail }: ClientProps) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [domainAdded, setDomainAdded] = useState(false)
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
  const [verified, setVerified] = useState(false)

  const { data: dnsData } = api.domain.fetchDns.useQuery(undefined, {
    retry: false,
    onSuccess: (data: { dnsRecords: string; verified: boolean }) => {
      try {
        const parsedRecords = JSON.parse(data.dnsRecords);
        setDnsRecords(parsedRecords);
        setVerified(data.verified ?? false);
        setDomainAdded(true);
      } catch (e) {
        console.error("Failed to handle DNS records:", e)
      }
    }
  })

  const createDomain = api.domain.create.useMutation({
    onSuccess: async (data) => {
      setEmail("");
      toast.success("Domain added successfully")
      setDomainAdded(true)
      setDnsRecords(JSON.parse(data.dnsRecords))
      setVerified(data.verified)
    },
    onError: (err) => {
      toast.error(err.message ?? "Something went wrong")
    },
  });

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const validateEmail = (value: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(value)) return false

    const parts = value.split('@')
    if (parts.length !== 2) return false
    
    const domain = parts[1]?.toLowerCase()
    if (!domain) return false
    
    const restrictedDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'aol.com']
    if (restrictedDomains.includes(domain)) {
      return false
    }

    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setEmail(value)
    setError("")
  }

  const handleDomainAction = () => {
    if (!email) {
      setError("Email is required")
      return
    }
    if (!validateEmail(email)) {
      const parts = email.split('@')
      const domain = parts[1]
      if (domain && ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'aol.com'].includes(domain.toLowerCase())) {
        setError("Please use your own domain email address, not a public email service")
      } else {
        setError("Please enter a valid email address from your own domain")
      }
      return
    }
    
    const parts = email.split('@')
    const domain = parts[1]
    if (!domain) {
      setError("Invalid email format")
      return
    }

    if (domainAdded) {
      // Handle edit domain logic here
      toast.success("Domain updated successfully")
    } else {
      createDomain.mutate({ domain: domain.toLowerCase() })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-3xl relative overflow-hidden">
        <ShineBorder shineColor={"black"} />
        <CardHeader>
          <CardTitle className="text-2xl">Email Configuration</CardTitle>
          <CardDescription>Set up email receiving capabilities</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Receive Emails</h3>
            </div>
            <p className="text-sm text-muted-foreground">Forward inbound emails to this address to receive customer emails in your workspace:</p>
            
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-muted rounded-md text-sm break-all">{hashEmail}</code>
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(hashEmail)} className="h-10 w-10 shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy email address</span>
              </Button>
            </div>

            <div className="border-t my-6" />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sending Email Setup</h3>
              <p className="text-sm text-muted-foreground">Enter the email address you want to use for sending emails (e.g., support@yourdomain.com)</p>
              
              <div className="space-y-2">
                <Input
                  placeholder="Enter your email (e.g., support@yourdomain.com)"
                  value={email}
                  onChange={handleEmailChange}
                  className="max-w-md"
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button onClick={handleDomainAction} className="mt-4">
                  {domainAdded ? "Edit Domain" : "Add Domain"}
                </Button>
              </div>
            </div>
          </div>

          {dnsRecords.length > 0 && (
            <DNSRecords records={dnsRecords} verified={verified} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
