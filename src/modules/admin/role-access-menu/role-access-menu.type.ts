import { InferInsertModel } from "drizzle-orm";
import { roleAccessMenuTable } from "../../../models/role-access-menu";

export type InsertRoleAccessMenu = InferInsertModel<typeof roleAccessMenuTable>