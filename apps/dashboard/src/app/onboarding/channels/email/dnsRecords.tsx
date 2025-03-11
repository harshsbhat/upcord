"use client"

import { useEffect, useState } from "react"
import { api } from "@/trpc/react"
import { DNSRecord } from "./client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function DNSRecords() {
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
  const [verified, setVerified] = useState(false)

  const { data, refetch } = api.domain.fetchDns.useQuery(undefined, {
    retry: false,
  })

  useEffect(() => {
    if (data) {
      setDnsRecords(data.dnsRecords)
      setVerified(data.verified ?? false)
    }
  }, [data])

  const verifyDomain = api.domain.verify.useMutation({
    onSuccess: () => {
      void refetch()
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">DNS Records</h3>
        <Button 
          onClick={() => verifyDomain.mutate()}
          disabled={verified}
        >
          {verified ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Verified
            </>
          ) : (
            'Verify DNS'
          )}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>TTL</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dnsRecords.map((record, index) => (
            <TableRow key={index}>
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.value}</TableCell>
              <TableCell>{record.ttl}</TableCell>
              <TableCell>{record.priority || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

