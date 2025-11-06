import { db } from "../../../config/db.config"
import { roleAccessMenuTable } from "../../../models/role-access-menu"
import { InsertRoleAccessMenu } from "./role-access-menu.type"

class RoleAccessMenuRepository {
  public static async create(data: InsertRoleAccessMenu) {
    const insert = await db.insert(roleAccessMenuTable).values(data)
  }

  public static async findAll() {

  }
}

export const roleAccessMenuRepository = new RoleAccessMenuRepository()