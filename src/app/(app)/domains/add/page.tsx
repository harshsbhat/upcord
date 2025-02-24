"use client";

import type React from "react";
import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";

const domainSchema = z
  .string()
  .regex(
    /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,63}$/,
    "Invalid domain name",
  );

export default function Client() {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createDomain = api.domain.create.useMutation({
    onSuccess: async (data) => {
      toast({
        title: "Domain Added",
        description: "Your domain has been successfully added!",
        variant: "default",
      });
      setDomain("");
      if (data.id) {
        window.location.href = `/domains/${data.id}`;
      }
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      domainSchema.parse(domain);
      createDomain.mutate({ domain });
      setError(null);
    } catch (err) {
      console.error(err)
      setError("Invalid domain");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-xl space-y-6 p-4">
        <Card className="shadow-sm">
          <CardHeader className="space-y-1 p-4">
            <CardTitle className="text-base">Add Domain</CardTitle>
            <CardDescription className="text-xs">
              Enter your domain name to begin the verification process.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <form onSubmit={handleDomainSubmit}>
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-xs">
                  Domain Name
                </Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="domain"
                      placeholder="example.com"
                      className={`pl-8 text-sm ${error ? "border-red-500" : ""}`}
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={createDomain.isPending}
                  >
                    {createDomain.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
