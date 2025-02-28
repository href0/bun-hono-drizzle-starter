import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { menuSchemaQuery, menuSchemaResponse, menuSchemaUpdate } from "./menu.schema";
import { menusTable } from "../../models/menu.model";

export type Menu = InferSelectModel<typeof menusTable>
export type InsertMenu = InferInsertModel<typeof menusTable>
export type UpdateMenu = z.infer<typeof menuSchemaUpdate> & {
  updatedBy: number;
};
export type SelectMenu = z.infer<typeof menuSchemaResponse>
export type MenuQuerySchema = z.infer<typeof menuSchemaQuery>