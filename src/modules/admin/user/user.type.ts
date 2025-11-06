import { z } from "zod";
import { insertUserSchema, userResponseSchema, updateUserSchema, userQuerySchema, userDetailResponseSchema } from "./user.schema";
import { usersTable } from "../../../models/user.model";

// --- DB layer (Drizzle)
export type User = typeof usersTable.$inferSelect
export type UserInsert = typeof usersTable.$inferInsert
type NonUpdatableUserFields = 'id' | 'password' | 'refreshToken' | 'createdAt' | 'createdBy';
export type UserUpdate = Partial<Omit<UserInsert, NonUpdatableUserFields>>

// --- DTOs (request body)
export type CreateUserDTO = z.infer<typeof insertUserSchema>
export type UpdateUserDTO = z.infer<typeof updateUserSchema>

// --- Query params
export type UserQuery = z.infer<typeof userQuerySchema>

// --- API responses
export type UserResponse = z.infer<typeof userResponseSchema>
export type UserDetailResponse = z.infer<typeof userDetailResponseSchema>