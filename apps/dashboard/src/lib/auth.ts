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
		organization({
			async sendInvitationEmail(data) {
                const inviteLink = `http://localhost:3000/accept-invitation/${data.id}`
                await resend.emails.send({
                    from: 'Upcord <noreply-upcord@sealnotes.com>',
                    to: [data.email],
                    subject: `Upcord: You are invited to join ${data.organization.name}`,
                    html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2>🎉 You’ve Been Invited to Join ${data.organization.name}!</h2>
                            <p>Hello,</p>
                            <p>You have been invited to join <b>${data.organization.name}</b> on Upcord. Click the button below to accept your invitation and get started.</p>
                            <a href="${inviteLink}" 
                            style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold;">
                            Accept Invitation
                            </a>
                            <p>If you didn’t expect this invitation, you can safely ignore this email.</p>
                            <p>Best,<br>Upcord Team</p>
                        </div>`,
                });
			},
		}),
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
