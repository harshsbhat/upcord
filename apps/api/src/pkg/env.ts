import { z } from "zod";

export const cloudflareRatelimiter = z.custom<{
  limit: (opts: { key: string }) => Promise<{ success: boolean }>;
}>((r) => !!r && typeof r.limit === "function");

export const zEnv = z.object({
  VERSION: z.string().default("unknown"),
  DATABASE_URL: z.string().url(),
  RL_10_60s: cloudflareRatelimiter,
  RL_30_60s: cloudflareRatelimiter,
  RL_50_60s: cloudflareRatelimiter,
  RL_200_60s: cloudflareRatelimiter,
  RL_600_60s: cloudflareRatelimiter,
  RL_1_10s: cloudflareRatelimiter,
  RL_500_10s: cloudflareRatelimiter,
  RL_200_10s: cloudflareRatelimiter,
});

export type Env = z.infer<typeof zEnv>;