import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";

export const rolesTable = pgTable(
  "roles", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 30 }).notNull(),
    isSuperadmin: boolean().default(false),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    createdBy: integer().notNull(),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    updatedBy: integer(),
  }, (table) => {
    return {
      nameIdx: uniqueIndex('role_name_idx').on(table.name)
    };
  }
);

export const rolesRelations = relations(rolesTable, ({ many, one }) => ({
  user: many(usersTable),
  createdBy: one(usersTable, {
    fields: [rolesTable.createdBy],
    references: [usersTable.id],
    relationName : 'createdBy'
  }),
  updatedBy: one(usersTable, {
    fields: [rolesTable.updatedBy],
    references: [usersTable.id],
    relationName : 'updatedBy'
  })
}));