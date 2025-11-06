import { relations, sql } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";
import { rolesTable } from "./role.model";
import { menusTable } from "./menu.model";
export const httpMethodEnum = pgEnum('http_method', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

export const roleAccessMenuTable = pgTable(
  "role_access_menu", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    roleId: integer().notNull().references(() => rolesTable.id, { onDelete: 'no action' }),
    menuId: integer().notNull().references(() => menusTable.id, { onDelete: 'no action' }),
    method: httpMethodEnum().notNull(),
    isActive: boolean().default(false).notNull(),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    createdBy: integer().notNull().references(() => usersTable.id, { onDelete: 'no action' }),
    updatedBy: integer().references(() => usersTable.id, { onDelete: 'no action' }),
  }, (table) => [
    unique('role_access_menu_unique').on(table.roleId, table.menuId, table.method)
  ]
);

export const rolesPermissionRelations = relations(roleAccessMenuTable, ({ one }) => ({
  subMenu: one(menusTable, {
    fields: [roleAccessMenuTable.menuId],
    references: [menusTable.id],
    relationName : 'subMenu'
  }),
  createdBy: one(usersTable, {
    fields: [roleAccessMenuTable.createdBy],
    references: [usersTable.id],
    relationName : 'createdBy'
  }),
  updatedBy: one(usersTable, {
    fields: [roleAccessMenuTable.updatedBy],
    references: [usersTable.id],
    relationName : 'updatedBy'
  })
}));