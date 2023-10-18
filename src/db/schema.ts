import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const uploadStatus = pgEnum("upload_status", [
  "SUCCESS",
  "PENDING",
  "FAILED",
  "PROCESSING",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  // File: File[],
  // Message: Message[],
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripePriceId: text("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
});

export const file = pgTable("file", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  uploadStatus: uploadStatus("upload_status").default("PENDING").notNull(),
  url: text("url").notNull(),
  key: text("key").notNull(),
  // messages: message[]
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const message = pgTable("message", {
  id: uuid("id").defaultRandom().primaryKey(),
  text: text("text").notNull(),
  isUserMessage: boolean("is_user_message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: text("user_id").references(() => user.id),
  fileId: uuid("file_id").references(() => file.id),
});

export type UserType = typeof user.$inferSelect;
export type FileType = typeof file.$inferSelect;
export type MessageType = typeof message.$inferSelect;
