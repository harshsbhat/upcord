import { pgTable, uuid, timestamp, text, varchar, boolean } from "drizzle-orm/pg-core";
import { customers } from "./customer";
import { threads } from "./threads";

export const messages = pgTable("messages", {
    id: text("id").primaryKey(),
    threadId: text("thread_id").notNull().references(() => threads.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").notNull().references(() => customers.id),
    content: text("content").notNull(), 
    isInternal: boolean("is_internal").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  });
  