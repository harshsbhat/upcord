import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { threads } from "./threads";
import { member } from "./auth";

export const messages = pgTable("messages", {
  id: varchar("id", { length: 256 }).primaryKey(),
  threadId: varchar("thread_id", { length: 256 }).references(() => threads.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  createdBy: varchar("created_by").references(() => member.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at")
});
