import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_REDIRECT_URI: z.string().url(),
    RESEND_API_KEY: z.string(),
    UNKEY_ROOT_KEY: z.string(),
    UNKEY_API_ID: z.string(),
    DATABASE_URL: z.string().url(),
    POSTMARK_WEBHOOK_URL: z.string().url(),
    POSTMARK_ACCOUNT_TOKEN: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    UNKEY_ROOT_KEY: process.env.UNKEY_ROOT_KEY,
    UNKEY_API_ID: process.env.UNKEY_API_ID,
    POSTMARK_ACCOUNT_TOKEN: process.env.POSTMARK_ACCOUNT_TOKEN,
    POSTMARK_WEBHOOK_URL: process.env.POSTMARK_WEBHOOK_URL,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
