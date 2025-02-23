import { getTenant } from "@/lib/getTenant";
import { db } from "@/server/db";
import { redirect } from "next/navigation";

export default async function Domains() {
    const tenantId = await getTenant();
    const domains = await db.query.domains.findMany({
        where: (table, { and, eq, isNull }) =>
            and(eq(table.workspaceId, tenantId), isNull(table.deletedAt)),
    });

    // to make sure just one domain is allowed
    if (domains.length === 0) {
        return redirect("/domains/add");
    }

    const domain = domains[0]; 

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-xl font-semibold">Your Domain</h1>
            <p className="text-gray-600 mt-2">{domain?.id}</p>
        </div>
    );
}
