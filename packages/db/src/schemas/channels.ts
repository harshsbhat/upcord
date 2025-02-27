import { boolean, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const channels = pgTable("channels", {
    id: varchar("id", { length: 256 }).primaryKey(),
    workspaceId: varchar("workspaceId", { length: 256 }).references(() => workspaces.id), 
    // Categories will have details of channels like Slack, Email and Forms
    category: varchar("category", { length: 50 }),
    connected: boolean("connected").default(false),
    createdAt: timestamp("created_at").notNull(),
    deletedAt: timestamp("deleted_at")
  });