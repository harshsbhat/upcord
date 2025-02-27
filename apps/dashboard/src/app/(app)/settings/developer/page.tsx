import { db } from "../../../../../../../packages/db"
import Client from "./client"
import { getTenant } from "@/lib/getTenant"

export default async function DeveloperSettings() {
    
    const tenantId = await getTenant()
    const workspace = await db.query.workspaces.findFirst({
        where: (table, { and, eq, isNull }) =>
            and(eq(table.tenantId, tenantId), isNull(table.deletedAt))
    })
    const workspaceId = workspace?.id
    const apiKeys = await db.query.apiKeys.findMany({
        where: (table, { and, eq, isNull }) =>
            and(eq(table.workspaceId, workspaceId!), isNull(table.deletedAt))
    })
    const apiKeysFormatted = apiKeys.map(key => ({
        ...key,
        createdAt: key.createdAt.toISOString(),
    }));
    return (
    <div>
        <Client apiKeys={apiKeysFormatted} />
    </div>
    )
}