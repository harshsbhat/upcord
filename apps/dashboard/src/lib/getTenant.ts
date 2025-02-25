import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getTenant() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const organizations = await auth.api.getFullOrganization({
        headers: await headers(),
    });

    const orgId = organizations?.id
    const userId = session?.user?.id;

    if (orgId) return orgId;
    if (userId) return userId;

    return redirect("/auth/sign-in");
}
