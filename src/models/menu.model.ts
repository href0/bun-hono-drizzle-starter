import { relations } from "drizzle-orm";
import { AnyPgColumn, boolean, integer, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";

export const menusTable = pgTable(
  "menus", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    parentId: integer().references((): AnyPgColumn => menusTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    name: varchar({ length: 50 }).notNull(),
    icon: varchar({ length: 50 }).notNull(),
    url: varchar({ length: 50 }).notNull().default('#'),
    apiEndpoint: varchar({ length: 50 }),
    apiDescription: varchar({ length: 100 }),
    isActive: boolean().default(false).notNull(),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    createdBy: integer().notNull().references(() => usersTable.id, { onDelete: 'no action' }),
    updatedBy: integer().references(() => usersTable.id, { onDelete: 'no action' }),
  }, (table) => {
    return {
      nameIdx: uniqueIndex('menu_name_idx').on(table.name),
      apiEndpointIdx: uniqueIndex('api_endpoint_idx').on(table.apiEndpoint),
    };
  }
);

export const menuRelations = relations(menusTable, ({ many, one }) => ({
  // parent: one(menusTable, {
  //   fields: [menusTable.parentId],
  //   references: [menusTable.id],
  //   relationName: 'parent_child',
  // }),
  // children: many(menusTable, {
  //   relationName: 'parent_child',
  // }),
  createdByUser: one(usersTable, {
    fields: [menusTable.createdBy],
    references: [usersTable.id],
    relationName : 'createdByUser'
  }),
  updatedByUser: one(usersTable, {
    fields: [menusTable.updatedBy],
    references: [usersTable.id],
    relationName : 'updatedByUser'
  })
}));