import { eq, SQL } from "drizzle-orm"
import { db } from "../../config/db.config"
import { rolesTable } from "../../models/role.model"
import { ROLE_SELECT } from "../../utils/constants/select.constant"
import { InsertRole, SelectRole } from "./role.type"

class RoleRepository {
  public async create(role: InsertRole): Promise<SelectRole> {
    const [ createdRole ] = await db.insert(rolesTable).values(role).returning(ROLE_SELECT)
    return createdRole
  }

  public async findById(id: number): Promise<SelectRole | null> {
    const [ role ] = await db
                          .select(ROLE_SELECT)
                          .from(rolesTable)
                          .where(eq(rolesTable.id, id))
    return role
  }

  public async findByName(name: string): Promise<SelectRole | null> {
    const [ role ] = await db
                          .select(ROLE_SELECT)
                          .from(rolesTable)
                          .where(eq(rolesTable.name, name))
    return role
  }

  public async update(id: number, data: Partial<InsertRole>): Promise<SelectRole> {
    const [ updatedRole ] = await db
                              .update(rolesTable)
                              .set(data)
                              .where(eq(rolesTable.id, id))
                              .returning(ROLE_SELECT)
    return updatedRole
  }

  public async delete(id: number): Promise<void> {
    await this._deleteWhere(eq(rolesTable.id, id))
  }

  public async deleteByName(name: string): Promise<void> {
    await this._deleteWhere(eq(rolesTable.name, name))
  }

   private async _deleteWhere(condition: SQL): Promise<void> {
      await db
        .delete(rolesTable)
        .where(condition)
  }
}

export const roleRepository = new RoleRepository()