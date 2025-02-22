"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DomainVerification from "./domainVerify"

export default function DomainInput() {
  const [domain, setDomain] = useState("")
  const [step, setStep] = useState(1)

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Verify Your Domain</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <Label htmlFor="domain">Enter Your Domain</Label>
                <Input id="domain" placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
              </div>
              <Button onClick={() => setStep(2)} disabled={!domain} className="w-full">
                Continue
              </Button>
            </div>
          ) : (
            <DomainVerification domain={domain} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
