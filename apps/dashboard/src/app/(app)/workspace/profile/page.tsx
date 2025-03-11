import ProfileClient from "./client"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session) {
    return redirect("/auth/signup")
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    image: session.user.image,
  }

  return <ProfileClient initialUser={user} />
}