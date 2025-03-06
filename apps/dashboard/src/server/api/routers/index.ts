import { t } from "../trpc"
import { createDomain } from "./domains/createDomain"
import { verifyDomain } from "./domains/verifyDomain"
import { createApiKey } from "./apiKeys/createKey"
import { revokeApiKey } from "./apiKeys/revokeKey"
import { createWorkspace } from "./workspaces/createWorkspace"

export const router = t.router({
    domain: t.router({
        create: createDomain,
        verify: verifyDomain
    }),
    apiKeys: t.router({
        create: createApiKey,
        revoke: revokeApiKey
    }),
    workspace: t.router({
        create: createWorkspace
    })
})
