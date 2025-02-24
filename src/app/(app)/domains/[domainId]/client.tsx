"use client"

import type React from "react"
import { useState } from "react"
import { Check, Copy, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DNSRecord } from "./page"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { api } from "@/trpc/react";

interface Props {
  records: DNSRecord[]
}

export const Client: React.FC<Props> = ({ records }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { toast } = useToast();
  const parsedRecords: DNSRecord[] = typeof records === "string" ? (JSON.parse(records) as DNSRecord[]) : records

  const verifyDomain = api.domain.verify.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Domain Added",
        description: "Your domain has been successfully added!",
        variant: "default",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
  })

  const handleVerify = () => {
    verifyDomain.mutate()
  }
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 1500)
      })
      .catch((error) => {
        console.error("Failed to copy text:", error)
      })
  }

  const truncate = (text: string, maxLength = 20) => (text.length > maxLength ? `${text.slice(0, maxLength)}...` : text)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>
      case "not_started":
        return <Badge className="bg-red-100 text-red-800">Not Started</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <TooltipProvider>
      <div className="mx-auto w-full max-w-5xl p-6">
        <Card className="shadow-sm">
          <CardHeader className="p-4">
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-lg">DNS Records</CardTitle>
                <CardDescription className="text-sm">Verify your DNS records</CardDescription>
              </div>
              <Button onClick={handleVerify}>Verify</Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <Table className="w-full border border-gray-200">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="w-20">Type</TableHead>
                  <TableHead className="w-48">Name</TableHead>
                  <TableHead className="w-auto">Content</TableHead>
                  <TableHead className="w-20">TTL</TableHead>
                  <TableHead className="w-20">Priority</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parsedRecords.map((record, index) => (
                  <TableRow key={index} className="border-b">
                    <TableCell className="py-3">{record.type}</TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger>{truncate(record.name)}</TooltipTrigger>
                          <TooltipContent>{record.name}</TooltipContent>
                        </Tooltip>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => copyToClipboard(record.name, `name-${index}`)}
                        >
                          {copiedField === `name-${index}` ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger>{truncate(record.value)}</TooltipTrigger>
                          <TooltipContent>{record.value}</TooltipContent>
                        </Tooltip>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => copyToClipboard(record.value, `content-${index}`)}
                        >
                          {copiedField === `content-${index}` ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">{record.ttl}</TableCell>
                    <TableCell className="py-3">{record.priority ?? "-"}</TableCell>
                    <TableCell className="py-3">{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

