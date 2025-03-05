import { type Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["upcord_*"],
} satisfies Config;
