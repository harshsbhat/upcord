import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { messages } from "./messages";

export const attachments = pgTable("attachments", {
  id: varchar("id", { length: 256 }).primaryKey(),
  messageId: varchar("message_id", { length: 256 }).references(() => messages.id, { onDelete: "cascade" }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 50 }), // Optional: Store file type (e.g., image, pdf, etc.)
  uploadedAt: timestamp("uploaded_at").defaultNow()
});
