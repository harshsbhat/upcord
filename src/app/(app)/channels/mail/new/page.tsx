"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, CopyIcon, RefreshCw } from "lucide-react"

export default function DomainVerificationMinimal() {
  const [domain, setDomain] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleVerify = () => {
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setVerified(true)
    }, 2000)
  }

  const dnsRecords = [
    { type: "MX", value: "mx.example.com" },
    { type: "TXT (DKIM)", value: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..." },
    { type: "TXT (SPF)", value: "v=spf1 include:_spf.example.com ~all" },
    { type: "TXT (DMARC)", value: "v=DMARC1; p=none; rua=mailto:dmarc@example.com", recommended: true },
  ]

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Verify Your Domain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Required DNS Records</h3>
              <ul className="space-y-4">
                {dnsRecords.map((record, index) => (
                  <li key={index} className={record.recommended ? "opacity-70" : ""}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{record.type}</span>
                      {record.recommended && <span className="text-sm text-muted-foreground">Recommended</span>}
                    </div>
                    <div className="flex mt-1">
                      <Input value={record.value} readOnly className="flex-grow" />
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => navigator.clipboard.writeText(record.value)}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {verified && <CheckCircle2 className="text-green-500 mr-2" />}
                <span>{verified ? "Domain verified" : "Domain not verified"}</span>
              </div>
              <Button onClick={handleVerify} disabled={verifying || verified}>
                {verifying ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                {verifying ? "Verifying..." : "Verify Domain"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

