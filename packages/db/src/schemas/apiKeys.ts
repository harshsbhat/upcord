import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const apiKeys = pgTable("apiKeys", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  workspaceId: varchar("workspaceId", { length: 256 }).references(() => workspaces.id), 
  createdAt: timestamp("created_at").notNull(),
  deletedAt: timestamp("deleted_at"),
});