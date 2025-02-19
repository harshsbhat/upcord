import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getTennant() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const organization = await auth.api.getFullOrganization({
        headers: await headers()
    })
    return {
        userId: session?.user.id,
        organizationId: organization?.id
    }
}
