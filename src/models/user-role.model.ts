import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";

export const userRolesTable = pgTable(
  "user_roles", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().notNull().references(() => usersTable.id, { onDelete: 'no action' }),
    roleId: integer().notNull(),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    createdBy: integer().notNull().references(() => usersTable.id, { onDelete: 'no action' }),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    updatedBy: integer().references(() => usersTable.id, { onDelete: 'no action' }),
  }
);

export const rolesRelations = relations(userRolesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userRolesTable.userId],
    references: [usersTable.id],
    relationName : 'user'
  }),
  createdBy: one(usersTable, {
    fields: [userRolesTable.createdBy],
    references: [usersTable.id],
    relationName : 'createdBy'
  }),
  updatedBy: one(usersTable, {
    fields: [userRolesTable.updatedBy],
    references: [usersTable.id],
    relationName : 'updatedBy'
  })
}));