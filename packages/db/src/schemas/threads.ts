import { pgTable, uuid, timestamp, text, varchar } from "drizzle-orm/pg-core";
import { member } from "./auth"
import { channels } from "./channels"
import { workspaces } from "./workspaces"

export const threads = pgTable("threads", {
  id: text("id").primaryKey(),
  workspaceId: varchar("workspaceId", { length: 256 }).references(() => workspaces.id), 
  subject: text("title").notNull(),
  createdBy: uuid("created_by").notNull().references(() => member.id),
  channelName: varchar("channelName", {length: 356}).references(() => channels.category),
  assignedTo: text("assigned_to").references(() => member.id),
  status: text("status").notNull().default("open"), 
  tag: text("tag").notNull().default(""),
  priority: text("priority").notNull().default("normal"), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
