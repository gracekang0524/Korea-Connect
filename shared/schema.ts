import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";
import { users } from "./models/auth";

// === JOBS ===
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  salary: text("salary"), // Text to allow "Negotiable", ranges, etc.
  contactInfo: text("contact_info").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobsRelations = relations(jobs, ({ one }) => ({
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
}));

export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true });
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

// === HOUSING ===
export const housing = pgTable("housing", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  type: text("type").notNull(), // Apartment, Villa, Officetel, etc.
  rent: integer("rent").notNull(), // Monthly rent
  deposit: integer("deposit").notNull(), // Key money
  location: text("location").notNull(),
  description: text("description").notNull(),
  images: text("images").array(), // URLs
  contactInfo: text("contact_info").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const housingRelations = relations(housing, ({ one }) => ({
  user: one(users, {
    fields: [housing.userId],
    references: [users.id],
  }),
}));

export const insertHousingSchema = createInsertSchema(housing).omit({ id: true, createdAt: true });
export type Housing = typeof housing.$inferSelect;
export type InsertHousing = z.infer<typeof insertHousingSchema>;

// === MARKETPLACE ===
export const marketplace = pgTable("marketplace", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  condition: text("condition").notNull(), // New, Used - Good, Used - Fair
  category: text("category").notNull(), // Electronics, Furniture, Clothing, etc.
  images: text("images").array(), // URLs
  contactInfo: text("contact_info").notNull(),
  isSold: boolean("is_sold").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketplaceRelations = relations(marketplace, ({ one }) => ({
  user: one(users, {
    fields: [marketplace.userId],
    references: [users.id],
  }),
}));

export const insertMarketplaceSchema = createInsertSchema(marketplace).omit({ id: true, createdAt: true });
export type MarketplaceItem = typeof marketplace.$inferSelect;
export type InsertMarketplaceItem = z.infer<typeof insertMarketplaceSchema>;

// === GUIDES (Visa, Legal, Taxes, Bank, Car, Korean) ===
export const guides = pgTable("guides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Markdown supported
  category: text("category").notNull(), // visa, legal, tax, bank, car, korean_language
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGuideSchema = createInsertSchema(guides).omit({ id: true, createdAt: true });
export type Guide = typeof guides.$inferSelect;
export type InsertGuide = z.infer<typeof insertGuideSchema>;

// === FAVORITES ===
// Polymorphic-ish association using type + itemId
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemId: integer("item_id").notNull(),
  type: text("type").notNull(), // 'job', 'housing', 'marketplace'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true, createdAt: true });
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

// API Types
export type CreateJobRequest = InsertJob;
export type UpdateJobRequest = Partial<InsertJob>;

export type CreateHousingRequest = InsertHousing;
export type UpdateHousingRequest = Partial<InsertHousing>;

export type CreateMarketplaceItemRequest = InsertMarketplaceItem;
export type UpdateMarketplaceItemRequest = Partial<InsertMarketplaceItem>;

export type CreateGuideRequest = InsertGuide;
export type UpdateGuideRequest = Partial<InsertGuide>;
