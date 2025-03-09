import { pgTable, varchar, text, timestamp, } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { member } from "./auth";


export const threads = pgTable("threads", {
    id: varchar("id", { length: 256 }).primaryKey(),
    workspaceId: varchar("workspaceId", { length: 256 }).references(() => workspaces.id), 
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: text("status").default("open"),
    createdBy: varchar("created_by").references(() => member.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    deletedAt: timestamp("deleted_at")
  });

  