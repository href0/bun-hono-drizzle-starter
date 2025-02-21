import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";
import { rolesTable } from "./role.model";
import { permissionTable } from "./permission.model";
import { subMenuTable } from "./sub-menu.model";

export const rolePermissionTable = pgTable(
  "role_permissions", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    roleId: integer().notNull().references(() => rolesTable.id, { onDelete: 'no action' }),
    permissionId: integer().notNull().references(() => permissionTable.id, { onDelete: 'no action' }),
    subMenuId: integer().notNull().references(() => subMenuTable.id, { onDelete: 'no action' }),
    is_active: boolean().default(false),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    createdBy: integer().notNull().references(() => usersTable.id, { onDelete: 'no action' }),
    updatedBy: integer().references(() => usersTable.id, { onDelete: 'no action' }),
  }
);

export const rolesPermissionRelations = relations(rolePermissionTable, ({ one }) => ({
  subMenu: one(subMenuTable, {
    fields: [rolePermissionTable.subMenuId],
    references: [subMenuTable.id],
    relationName : 'subMenu'
  }),
  createdBy: one(usersTable, {
    fields: [rolePermissionTable.createdBy],
    references: [usersTable.id],
    relationName : 'createdBy'
  }),
  updatedBy: one(usersTable, {
    fields: [rolePermissionTable.updatedBy],
    references: [usersTable.id],
    relationName : 'updatedBy'
  })
}));