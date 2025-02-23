"use client"

import { User, Mail, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar, SidebarContent, SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function ProfilePage() {
  const session = useSession()
  const user = session.data?.user

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="container mx-auto py-10">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full"
                    unoptimized
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Name</div>
                  <p className="text-lg">{user?.name}</p>
                </div>
                
                <div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </div>
                  <p className="text-lg">{user?.email}</p>
                </div>
                
                <div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    {user?.emailVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Email Status
                  </div>
                  <p className="text-lg">
                    {user?.emailVerified ? "Verified" : "Not Verified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}