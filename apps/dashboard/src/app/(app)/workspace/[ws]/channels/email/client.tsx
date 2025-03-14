"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"


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
    dnsRecords: DNSRecord[];
  }

export default function Client({ hashEmail, dnsRecords }: ClientProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    void navigator.clipboard.writeText(hashEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex justify-center items-center">
    <Card className="w-2/3 border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Receive emails</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">This allows Upcord to show emails from customers.</p>

        <div className="space-y-2">
          <p className="text-sm font-medium">Forward inbound emails to this address:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 bg-muted rounded-md text-sm break-all">{hashEmail}</code>
            <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-10 w-10 shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy email address</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

