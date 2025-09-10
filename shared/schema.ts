import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const initiatives = pgTable("initiatives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  team: text("team").notNull(),
  priority: text("priority").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  assignees: text("assignees").array().default([]),
  quarter: text("quarter").notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInitiativeSchema = createInsertSchema(initiatives).omit({
  id: true,
  createdAt: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  team: z.enum(["engineering", "design", "product", "marketing", "sales"]),
  priority: z.enum(["high", "medium", "low"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  assignees: z.array(z.string()).default([]),
  quarter: z.enum(["Q1", "Q2", "Q3", "Q4"]),
  position: z.number().default(0),
});

export type InsertInitiative = z.infer<typeof insertInitiativeSchema>;
export type Initiative = typeof initiatives.$inferSelect;
