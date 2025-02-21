import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";
import { menuTable } from "./menu.model";
import { rolePermissionTable } from "./role-permission.model";

export const subMenuTable = pgTable(
  "sub_menus", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    menuId: integer().notNull().references(() => menuTable.id, { onDelete: 'no action' }),
    name: varchar({ length: 10 }).notNull(),
    icon: varchar({ length: 20 }).notNull(),
    endpoint: varchar({ length: 100 }).notNull(),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    createdBy: integer().notNull().references(() => usersTable.id, { onDelete: 'no action' }),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    updatedBy: integer().references(() => usersTable.id, { onDelete: 'no action' }),
  }, (table) => {
    return {
      nameIdx: uniqueIndex('sub_menu_name_idx').on(table.name)
    };
  }
);

export const subMenuRelations = relations(subMenuTable, ({ many, one }) => ({
  rolePermission: many(rolePermissionTable),
  menu: one(menuTable, {
    fields: [subMenuTable.menuId],
    references: [menuTable.id],
    relationName : 'menu'
  }),
  createdBy: one(usersTable, {
    fields: [subMenuTable.createdBy],
    references: [usersTable.id],
    relationName : 'createdBy'
  }),
  updatedBy: one(usersTable, {
    fields: [subMenuTable.updatedBy],
    references: [usersTable.id],
    relationName : 'updatedBy'
  })
}));