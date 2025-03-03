import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { db } from "@/server/db";
import { env } from "@/env";
 
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    socialProviders: {
        github: { 
            clientId: env.GITHUB_CLIENT_ID, 
            clientSecret: env.GITHUB_CLIENT_SECRET, 
            redirectURI: process.env.BETTER_AUTH_URL+'api/auth/callback/github'
        },
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            redirectURI: env.GOOGLE_REDIRECT_URI,
            scope: ["email", "profile"]
        }
    },
    plugins: [ 
        organization(), 
        nextCookies()
    ] 
});
