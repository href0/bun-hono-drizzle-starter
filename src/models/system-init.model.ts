import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";

export const systemInitTable = pgTable(
  'system_init',
  {
     id: integer().primaryKey().generatedAlwaysAsIdentity(),
     initializedAt : timestamp({withTimezone : true, mode :'date', precision : 3}).defaultNow().notNull(),
  }
)