import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const tests = pgTable("tests", {
    id: varchar("id", { length: 256 }).primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),

    // for personal workspace userId else orgId
    tenantId: varchar("tenant_id", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").notNull(),
    deletedAt: timestamp("deleted_at"),
  });