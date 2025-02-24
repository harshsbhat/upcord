"use client"

import type React from "react"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DNSRecord } from "./page"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Props {
  records: DNSRecord[]
}

export const Client: React.FC<Props> = ({ records }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const parsedRecords: DNSRecord[] = typeof records === "string" 
  ? (JSON.parse(records) as DNSRecord[]) 
  : records;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1500);
      })
      .catch((error) => {
        console.error("Failed to copy text:", error);
      });
  };
  

  const truncate = (text: string, maxLength = 20) => (text.length > maxLength ? `${text.slice(0, maxLength)}...` : text)

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
            <Button onClick={() => console.log("Nothing")}>
              Verify
            </Button>
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
                  <TableHead className="w-20">Status</TableHead>
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
                    <TableCell className="py-3">{record.status}</TableCell>
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
