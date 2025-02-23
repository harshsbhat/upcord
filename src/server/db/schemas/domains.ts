import { boolean, pgTable, text, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const domains = pgTable("domains", {
    id: varchar("id", { length: 256 }).primaryKey(),
    resendId: text("resendId").notNull(),
    name: varchar("name", {length: 256}).notNull(),
    workspaceId: varchar("workspaceId", { length: 256 }).references(() => workspaces.id), 
    // Categories will have details of channels like Slack, Email and Forms
    verified: boolean("verified").default(false),
    dnsRecords: text("dnsRecords").notNull(),
    createdAt: timestamp("created_at").notNull(),
    deletedAt: timestamp("deleted_at")
  });