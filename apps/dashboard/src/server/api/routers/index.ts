import { t } from "../trpc"
import { createDomain } from "./domains/createDomain"
import { verifyDomain } from "./domains/verifyDomain"
import { createApiKey } from "./apiKeys/createKey"
import { revokeApiKey } from "./apiKeys/revokeKey"
import { createWorkspace } from "./workspaces/createWorkspace"
import { getInvitations } from "./workspaces/getInvitations"
import { getMembers } from "./workspaces/getMembers"
import { fetchDns } from "./domains/fetchDns"

export const router = t.router({
    domain: t.router({
        create: createDomain,
        verify: verifyDomain,
        fetchDns: fetchDns
    }),
    apiKeys: t.router({
        create: createApiKey,
        revoke: revokeApiKey
    }),
    workspace: t.router({
        create: createWorkspace,
        getInvitations: getInvitations,
        getMembers: getMembers
    })
})
