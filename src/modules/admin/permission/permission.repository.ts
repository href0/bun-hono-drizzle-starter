import { eq, SQL } from "drizzle-orm"
import { db } from "../../../config/db.config"
import { permissionsTable } from "../../../models/permission.model"
import { PERMISSION_SELECT } from "../../../utils/constants/select.constant"
import { InsertPermission, SelectPermission } from "./permission.type"
import { PERMISSION_RETURNING } from "../../../utils/constants/returning.constant"

class PermissionRepository {
  public async create(data: InsertPermission): Promise<SelectPermission> {
    const [ insert ] = await db.insert(permissionsTable).values(data).returning(PERMISSION_RETURNING)
    return insert
  }

  public async findById(id: number): Promise<SelectPermission | null> {
    const [ result ] = await db
      .select(PERMISSION_SELECT)
      .from(permissionsTable)
      .where(eq(permissionsTable.id, id))
    return result
  }

  public async findByName(name: string): Promise<SelectPermission | null> {
    const [ result ] = await db
      .select(PERMISSION_SELECT)
      .from(permissionsTable)
      .where(eq(permissionsTable.name, name))
    return result
  }

  public async update(id: number, data: Partial<InsertPermission>): Promise<SelectPermission> {
    const [ result ] = await db
        .update(permissionsTable)
        .set(data)
        .where(eq(permissionsTable.id, id))
        .returning(PERMISSION_RETURNING)
    return result
  }

  public async delete(id: number): Promise<void> {
    await this._deleteWhere(eq(permissionsTable.id, id))
  }

  public async deleteByName(name: string): Promise<void> {
    await this._deleteWhere(eq(permissionsTable.name, name))
  }

    private async _deleteWhere(condition: SQL): Promise<void> {
      await db
        .delete(permissionsTable)
        .where(condition)
  }
}

export const permissionRepository = new PermissionRepository()