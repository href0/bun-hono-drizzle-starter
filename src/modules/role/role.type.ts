import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { rolesTable } from "../../models/role.model";
import { roleSchemaQuery, roleSchemaResponse, roleSchemaUpdate } from "./role.schema";

export type Role = InferSelectModel<typeof rolesTable>
export type InsertRole = InferInsertModel<typeof rolesTable>
export type UpdateRole = z.infer<typeof roleSchemaUpdate> & {
  updatedBy: number;
};
export type SelectRole = z.infer<typeof roleSchemaResponse>
export type RoleQuerySchema = z.infer<typeof roleSchemaQuery>