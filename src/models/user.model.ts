import { integer, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    refreshToken: text(),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  }, (table) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email)
    };
  }
);