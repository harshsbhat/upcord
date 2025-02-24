import { t } from "../trpc"
import { createDomain } from "./domains/createDomain"
import { verifyDomain } from "./domains/verifyDomain"

export const router = t.router({
    domain: t.router({
        create: createDomain,
        verify: verifyDomain
    })
})