"use client"

import { MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Domain = {
  id: string
  name: string
  createdAt: Date
  deletedAt: Date | null
  workspaceId: string | null
  resendId: string
  verified: boolean | null
  dnsRecords: string
}

export default function DomainsList({ domains }: { domains: Domain[] }) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Domains</h1>
      <div className="grid gap-4">
        {domains.map((domain) => (
          <Card
            key={domain.id}
            className="p-4 flex justify-between items-center transition-all hover:shadow-lg hover:bg-gray-100 cursor-pointer"
            onClick={() => (window.location.href = `workspace/domains/${domain.id}`)}
          >
            <CardContent className="flex flex-col gap-1">
              <p className="text-lg font-medium">{domain.name}</p>
              <p className="text-sm text-gray-500">ID: {domain.id}</p>
            </CardContent>
            <div className="flex items-center gap-4">
              <span className={`px-2 py-1 rounded text-white text-xs font-medium ${
                domain.verified ? "bg-green-500" : "bg-red-500"
              }`}>
                {domain.verified ? "Verified" : "Not Verified"}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}