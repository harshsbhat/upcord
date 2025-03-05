import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, emailOTP } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { db } from "@upcord/db";
import { env } from "@/env";
import { resend } from "./resend"
 
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
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, url }) => {
                await resend.emails.send({
                    from: 'Upcord <noreply-upcord@sealnotes.com>',
                    to: user.email,
                    subject: 'Upcord: Approve email change',
                    text: `Click the link to approve the change: ${url}`
                })
            }
        }
    },
    plugins: [  
        organization(), 
        nextCookies(),
        emailOTP({ 
            otpLength: 6,
            expiresIn: 600,
            async sendVerificationOTP({ email, otp}) { 
                await resend.emails.send({
                    from: 'Upcord <noreply-upcord@sealnotes.com>',
                    to: email,
                    subject: 'Upcord: Confirm your email address',
                    text: `Your OTP to veify email address is ${otp}`
                })
            }, 
         }),
    ] 
});
