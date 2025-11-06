import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { permissionSchemaQuery, permissionSchemaResponse, permissionSchemaUpdate } from "./permission.schema";
import { permissionsTable } from "../../../models/permission.model";

export type Permission = InferSelectModel<typeof permissionsTable>
export type InsertPermission = InferInsertModel<typeof permissionsTable>
export type UpdatePermission = z.infer<typeof permissionSchemaUpdate> & {
  updatedBy: number;
};
export type SelectPermission = z.infer<typeof permissionSchemaResponse>
export type PermissionQuerySchema = z.infer<typeof permissionSchemaQuery>

export type PermissionWithChildren = Permission & {
  children: PermissionWithChildren[];
};
