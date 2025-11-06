import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";
import { roleAccessMenuTable } from "./role-access-menu";

export const permissionsTable = pgTable(
  "permissions", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 30 }).notNull(),
    description: varchar({ length: 100 }),
    api: varchar({ length: 100 }).notNull(),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    createdBy: integer().notNull().references(() => usersTable.id, { onDelete: 'no action' }),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    updatedBy: integer().references(() => usersTable.id, { onDelete: 'no action' }),
  }, (table) => {
    return {
      permissionApiIdx: uniqueIndex('permission_api_idx').on(table.api),
    };
  }
);

export const permissionRelations = relations(permissionsTable, ({ one, many }) => ({
  roleAccessMenu: many(roleAccessMenuTable),
  createdBy: one(usersTable, {
    fields: [permissionsTable.createdBy],
    references: [usersTable.id],
    relationName : 'createdBy'
  }),
  updatedBy: one(usersTable, {
    fields: [permissionsTable.updatedBy],
    references: [usersTable.id],
    relationName : 'updatedBy'
  })
}));