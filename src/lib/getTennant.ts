import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getTennant() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const organziations = await auth.api.listOrganizations({
        headers: await headers()
    })

    return {
        userId: session?.user.id,
        organizationId: organziations[0]?.id
    }
}
