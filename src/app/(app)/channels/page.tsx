import { getTennant } from "@/lib/getTennant"
import ChannelsPage from "./channel"
import { db } from "@/server/db"

export default async function ChannelsMain() {
    const tennantId = await getTennant()
    const workspace = await db.query.workspaces.findFirst({
        where: (table, { and, eq, isNull }) =>
            and(eq(table.tenantId, tennantId), isNull(table.deletedAt)),
    })

    const channels = await db.query.channels.findMany({
        where: (table, { and, eq, isNull }) =>
            and(eq(table.workspaceId, workspace!.id), isNull(table.deletedAt)),
    })

    return <ChannelsPage channels={channels} />
}
