import { boolean, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    company: text("company"),
    meta: json("meta"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

