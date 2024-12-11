import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { responseUserSchema, updateUserSchema, userQuerySchema } from "./user.schema";
import { usersTable } from "../../models/user.model";

export type User = InferSelectModel<typeof usersTable>
export type InsertUser = InferInsertModel<typeof usersTable>
export type UpdateUser = z.infer<typeof updateUserSchema>
export type ResponseUser = z.infer<typeof responseUserSchema>
export type SelectUser = Partial<Record<keyof ResponseUser, boolean>>;
export type UserQuerySchema = z.infer<typeof userQuerySchema>