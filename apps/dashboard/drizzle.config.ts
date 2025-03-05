import { type Config } from "drizzle-kit";

export default {
  schema: "../../packages/db/src/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
