import { pgTable, text, timestamp, varchar, } from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    logoUrl: text("logo"),
    domainName: varchar("domainName", {length: 256}).notNull(),
    tier: varchar("tier", {length: 256}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });