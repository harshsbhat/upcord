import { getTenant } from "@/lib/getTenant"
import { db } from "@/server/db"
import ProfileClient from "./client"

export default async function ProfilePage() {
  const userId = await getTenant()
  const user = await db.query.user.findFirst({
    where: (table, { eq }) => eq(table.id, userId)
  })

  if (!user) {
    throw new Error("User not found")
  }

  return <ProfileClient initialUser={user} />
}
