import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"

export const {
    signIn, 
    signOut, 
    signUp, 
    useSession, 
    organization,
    useListOrganizations,
} =  createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [ 
        organizationClient() 
    ] 
})
