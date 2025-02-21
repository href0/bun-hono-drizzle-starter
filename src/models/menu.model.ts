import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";
import { subMenuTable } from "./sub-menu.model";

export const menuTable = pgTable(
  "menus", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 10 }).notNull(),
    icon: varchar({ length: 20 }).notNull(),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    createdBy: integer().notNull().references(() => usersTable.id, { onDelete: 'no action' }),
    updatedBy: integer().references(() => usersTable.id, { onDelete: 'no action' }),
  }, (table) => {
    return {
      nameIdx: uniqueIndex('menu_name_idx').on(table.name)
    };
  }
);

export const menuRelations = relations(menuTable, ({ many, one }) => ({
  subMenu: many(subMenuTable),
  createdBy: one(usersTable, {
    fields: [menuTable.createdBy],
    references: [usersTable.id],
    relationName : 'createdBy'
  }),
  updatedBy: one(usersTable, {
    fields: [menuTable.updatedBy],
    references: [usersTable.id],
    relationName : 'updatedBy'
  })
}));