import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for admin access
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

// Donations table for tracking individual donations
export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("ZAR"),
  donorName: text("donor_name"),
  donorEmail: text("donor_email"),
  projectId: uuid("project_id").references(() => projects.id),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull().default("tap"),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects table for tracking funded initiatives
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).notNull().default("0.00"),
  impactMetric: text("impact_metric"),
  imageUrl: text("image_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// System stats for overall platform metrics
export const systemStats = pgTable("system_stats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  totalRaised: decimal("total_raised", { precision: 12, scale: 2 }).notNull().default("0.00"),
  totalDonors: integer("total_donors").notNull().default(0),
  totalProjects: integer("total_projects").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const donationsRelations = relations(donations, ({ one }) => ({
  project: one(projects, {
    fields: [donations.projectId],
    references: [projects.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  donations: many(donations),
}));

// Validation constants
const VALID_CURRENCIES = ["ZAR", "USD", "EUR", "GBP", "CAD", "AUD"] as const;
const VALID_PAYMENT_METHODS = ["tap", "card", "bank_transfer", "crypto"] as const;
const VALID_PROJECT_STATUSES = ["active", "completed", "paused", "cancelled"] as const;
const VALID_DONATION_STATUSES = ["completed", "pending", "failed", "refunded"] as const;

// Base validation schemas
export const uuidSchema = z.string().uuid("Invalid UUID format");
export const positiveDecimalSchema = z.string().refine(
  (val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  },
  "Amount must be a positive number"
);

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  passwordHash: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username too long"),
});

export const createUserSchema = insertUserSchema.omit({ passwordHash: true }).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertDonationSchema = createInsertSchema(donations).pick({
  amount: true,
  currency: true,
  donorName: true,
  donorEmail: true,
  projectId: true,
  paymentMethod: true,
}).extend({
  amount: positiveDecimalSchema,
  currency: z.enum(VALID_CURRENCIES, {
    errorMap: () => ({ message: `Currency must be one of: ${VALID_CURRENCIES.join(", ")}` })
  }),
  donorName: z.string().min(1, "Donor name is required").max(100, "Donor name too long").optional(),
  donorEmail: z.string().email("Invalid email format").max(255, "Email too long").optional(),
  projectId: uuidSchema.optional(),
  paymentMethod: z.enum(VALID_PAYMENT_METHODS, {
    errorMap: () => ({ message: `Payment method must be one of: ${VALID_PAYMENT_METHODS.join(", ")}` })
  }),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  location: true,
  status: true,
  targetAmount: true,
  impactMetric: true,
  imageUrl: true,
  isFeatured: true,
}).extend({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().min(1, "Description is required").max(2000, "Description too long"),
  location: z.string().min(1, "Location is required").max(200, "Location too long"),
  status: z.enum(VALID_PROJECT_STATUSES, {
    errorMap: () => ({ message: `Status must be one of: ${VALID_PROJECT_STATUSES.join(", ")}` })
  }).optional(),
  targetAmount: positiveDecimalSchema.optional(),
  impactMetric: z.string().max(500, "Impact metric too long").optional(),
  imageUrl: z.string().url("Invalid URL format").max(500, "URL too long").optional(),
  isFeatured: z.boolean().optional(),
});

export const updateProjectSchema = insertProjectSchema.partial().extend({
  currentAmount: positiveDecimalSchema.optional(),
});

// Path parameter validation schemas
export const projectIdParamSchema = z.object({
  id: uuidSchema,
});

export const projectDonationParamSchema = z.object({
  projectId: uuidSchema,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type SystemStats = typeof systemStats.$inferSelect;
