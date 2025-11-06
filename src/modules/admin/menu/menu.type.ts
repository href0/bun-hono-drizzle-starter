import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { menuSchemaQuery, menuSchemaResponse, menuSchemaUpdate } from "./menu.schema";
import { menusTable } from "../../../models/menu.model";

export type Menu = {
  id: number;
  name: string;
  icon: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  createdBy?: {
    id: number;
    email: string;
    name: string;
  } | null;
  updatedBy?: {
    id: number;
    email: string;
    name: string;
  } | null;
  childs?: Menu[];
}
export type InsertMenu = InferInsertModel<typeof menusTable>
export type UpdateMenu = z.infer<typeof menuSchemaUpdate> & {
  updatedBy: number;
};
export type SelectMenu = InferSelectModel<typeof menusTable>
export type ResponseMenu = z.infer<typeof menuSchemaResponse>
export type MenuQuerySchema = z.infer<typeof menuSchemaQuery>

export type MenuWithChildren = Menu & {
  children: MenuWithChildren[];
};
