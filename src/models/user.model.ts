import { aliasedTable, relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { rolesTable } from "./role.model";
import { userRolesTable } from "./user-role.model";
import { menusTable } from "./menu.model";

export const usersTable = pgTable(
  "users", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    roleId: integer().references(() => rolesTable.id, { onDelete: 'no action' }),
    refreshToken: text(),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    createdBy: integer(),
    updatedBy: integer(),
  }, (table) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
    };
  }
);

export const usersRelations = relations(usersTable, ({ one, many }) => ({
	role: one(rolesTable, {
    fields: [usersTable.roleId],
    references: [rolesTable.id]
  }),
  roleCreatedBy: many(rolesTable),
  roleUpdatedBy: many(rolesTable),
  userRoleCreatedBy: many(userRolesTable),
  userRoleUpdatedBy: many(userRolesTable),
  menuUpdatedBy: many(menusTable),
  menuCreateddBy: many(menusTable),
  createdByUser: one(usersTable, {
    fields: [usersTable.createdBy],
    references: [usersTable.id]
  })
}));