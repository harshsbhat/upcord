import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const postmark = pgTable("postmark", {
    id: varchar("id", { length: 256 }).primaryKey(),
    serverId: text("serverId").notNull(),
    name: varchar("name", {length: 256}).notNull(),
    workspaceId: varchar("workspaceId", { length: 256 }).references(() => workspaces.id), 
    inboundHash: varchar("inboundHash", {length: 256}),
    createdAt: timestamp("created_at").notNull(),
    deletedAt: timestamp("deleted_at")
  });