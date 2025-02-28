import { is, relations } from "drizzle-orm";
import { boolean, integer, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./user.model";

export const permissionTable = pgTable(
  "permissions", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 10 }).notNull(),
    description: varchar({ length: 100 }),
    url: varchar({ length: 100 }).notNull(),
    method: varchar({ length: 10, enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }).notNull(),
    createdAt: timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
    createdBy: integer().notNull().references(() => usersTable.id, { onDelete: 'no action' }),
    updatedAt: timestamp({withTimezone : true, mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
    updatedBy: integer().references(() => usersTable.id, { onDelete: 'no action' }),
  }, (table) => {
    return {
      nameIdx: uniqueIndex('permission_name_idx').on(table.name),
      endpointMethodIdx: uniqueIndex('endpoint_method_idx').on(table.url, table.method)
    };
  }
);

export const permissionRelations = relations(permissionTable, ({ one }) => ({
  createdBy: one(usersTable, {
    fields: [permissionTable.createdBy],
    references: [usersTable.id],
    relationName : 'createdBy'
  }),
  updatedBy: one(usersTable, {
    fields: [permissionTable.updatedBy],
    references: [usersTable.id],
    relationName : 'updatedBy'
  })
}));