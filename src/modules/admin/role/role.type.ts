import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { rolesTable } from "../../../models/role.model";
import { roleQuerySchema, roleResponseSchema, roleDetailResponseSchema, createRoleSchema, updateRoleSchema } from "./role.schema";

// --- DB layer (Drizzle)
export type Role = typeof rolesTable.$inferSelect
export type RoleInsert = typeof rolesTable.$inferInsert
export type RoleUpdate = Partial<RoleInsert>

// --- DTOs (request body)
export type CreateRoleDTO = z.infer<typeof createRoleSchema>
export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>

// --- Query params
export type RoleQuery = z.infer<typeof roleQuerySchema>

// --- API responses
export type RoleResponse = z.infer<typeof roleResponseSchema>
export type RoleDetailResponse = z.infer<typeof roleDetailResponseSchema>
