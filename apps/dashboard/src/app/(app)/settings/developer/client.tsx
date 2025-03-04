"use client"

import { useState } from "react"
import { PlusCircle, Copy, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from "@/trpc/react"
import { useToast } from "@/hooks/use-toast"

interface ApiKey {
  id: string
  name: string | undefined
  createdAt: string
}

interface ApiKeysPageProps {
  apiKeys: ApiKey[]
}

export default function ApiKeysPage({ apiKeys }: ApiKeysPageProps) {
  const [newKeyName, setNewKeyName] = useState("")
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null)

  const createApiKey = api.apiKeys.create.useMutation({
    onSuccess: (data) => {
      setCreatedKey(data.key)
      toast({
        title: "New API key created",
        description: "Your new key has been created",
        variant: "default",
      })
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message ?? "Something went wrong",
        variant: "destructive",
      })
    },
  })

  const revokeApiKey = api.apiKeys.revoke.useMutation({
    onSuccess: () => {
      setDeleteDialogOpen(false)
      toast({
        title: "API key deleted successfully",
        description: "Your API key has been deleted",
        variant: "default",
      })
    },
    onError: (err) => {
      setDeleteDialogOpen(false)
      toast({
        title: "Error",
        description: err.message ?? "Something went wrong",
        variant: "destructive",
      })
    },
  })

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return
    createApiKey.mutate({ name: newKeyName })
  }

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey)
      .then(() => {
        toast({ title: "Copied", description: "API key copied to clipboard" })
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to copy API key", variant: "destructive" })
      })
    }
  }

  const handleRevoke = () => {
    if (keyToDelete) {
      revokeApiKey.mutate({ keyId: keyToDelete })
      setConfirmDelete("")
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">API Keys</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex items-center gap-1 h-8">
                <PlusCircle className="h-3.5 w-3.5" />
                New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
              </DialogHeader>
              {createdKey ? (
                <div className="py-3">
                  <Label className="text-xs">Generated Key. <span className="font-semibold">This key is one way hashed meaning you cannot see this key again. Please store this somewhere safe.</span></Label>
                  <div className="flex items-center mt-3 gap-2 border p-2 rounded-md">
                    <code className="text-xs truncate">{createdKey}</code>
                    <Button size="icon" variant="ghost" onClick={handleCopy}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-3">
                  <Label htmlFor="name" className="text-xs font-medium">Name</Label>
                  <Input
                    id="name"
                    className="mt-1 h-8"
                    placeholder="My API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
              )}
              <DialogFooter>
                {!createdKey ? (
                  <Button size="sm" onClick={handleCreateKey} disabled={createApiKey.isPending}>
                    {createApiKey.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                  </Button>
                ) : (
                  <Button className="w-full" size="sm" onClick={() => { setOpen(false); setCreatedKey(null) }}>
                    I have copied the key and stored it somewhere safe.
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="pt-0">
          {apiKeys.length === 0 ? (
            <div className="flex items-center justify-center py-6 text-center border border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">No API keys</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Key Id</TableHead>
                  <TableHead className="text-xs">Created</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="py-2 text-sm">{apiKey.name}</TableCell>
                    <TableCell className="py-2 text-sm">{apiKey.id}</TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">{apiKey.createdAt}</TableCell>
                    <TableCell className="py-2 text-xs">
                      <span className="cursor-pointer text-red-700" onClick={() => { setKeyToDelete(apiKey.id); setDeleteDialogOpen(true); }}>
                        Revoke
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Type <strong>DELETE</strong> to confirm you want to delete this API key.</p>
          <p><strong>NOTE: </strong> This action is irreversible</p>
          <Input value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)} placeholder="Type DELETE to confirm" />
          <DialogFooter>
            <Button variant="destructive" disabled={confirmDelete !== "DELETE" || revokeApiKey.isPending} onClick={handleRevoke}>
              {revokeApiKey.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
