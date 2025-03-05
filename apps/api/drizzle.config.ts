import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
