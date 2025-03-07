import { getTenant } from "@/lib/getTenant"
import ChannelsPage from "./channel"
import { db } from "@upcord/db"

export default async function ChannelsMain() {
    const tenantId = await getTenant()
    const workspace = await db.query.workspaces.findFirst({
        where: (table, { and, eq, isNull }) =>
            and(eq(table.tenantId, tenantId), isNull(table.deletedAt)),
    })

    const channels = await db.query.channels.findMany({
        where: (table, { and, eq, isNull }) =>
            and(eq(table.workspaceId, workspace!.id), isNull(table.deletedAt)),
    })

    return <ChannelsPage channels={channels} />
}
