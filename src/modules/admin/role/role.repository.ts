import { desc, eq, SQL } from "drizzle-orm"
import { db } from "../../../config/db.config"
import { rolesTable } from "../../../models/role.model"
import { RoleDetailResponse, RoleInsert, RoleResponse } from "./role.type"
import { ROLE_RETURNING } from "../../../utils/constants/returning.constant"
import { creator, updater } from "../../../db/aliases"
import { usersTable } from "../../../models/user.model"

export const ROLE_SELECT = {
  id : rolesTable.id,
  name : rolesTable.name,
  updatedAt : rolesTable.updatedAt,
  createdAt : rolesTable.createdAt,
  createdByUser: {
    id: creator.id,
    name: creator.name,
  },
  updatedByUser: {
    id: updater.id,
    name: updater.name,
  }
}

export class RoleRepository {

  constructor(private readonly conn: typeof db = db) {}

  public async create(role: RoleInsert): Promise<RoleResponse> {
    const [ result ] = await this.conn.insert(rolesTable).values(role).returning(ROLE_RETURNING)
    return result
  }

  public async findById(id: number): Promise<RoleDetailResponse | null> {
    const [ result ] = await this.conn
      .select(ROLE_SELECT)
      .from(rolesTable)
      .leftJoin(creator, eq(rolesTable.createdBy, creator.id))
      .leftJoin(updater, eq(rolesTable.updatedBy, updater.id))
      .where(eq(rolesTable.id, id))
      .limit(1)

    const users = await this.conn
      .select({
        id: usersTable.id,
        name: usersTable.name
      })
      .from(usersTable)
      .where(eq(usersTable.roleId, id))
      .orderBy(desc(usersTable.createdAt))

    return result ? { ...result, users } : null
  }

  public async findByName(name: string): Promise<RoleResponse | null> {
    const [ result ] = await this.conn
      .select(ROLE_SELECT)
      .from(rolesTable)
      .where(eq(rolesTable.name, name))
    return result
  }

  public async update(id: number, data: Partial<RoleInsert>): Promise<RoleResponse> {
    const [ result ] = await this.conn
      .update(rolesTable)
      .set(data)
      .where(eq(rolesTable.id, id))
      .returning(ROLE_RETURNING)
    return result
  }

  public async delete(id: number): Promise<void> {
    await this._deleteWhere(eq(rolesTable.id, id))
  }

  public async deleteByName(name: string): Promise<void> {
    await this._deleteWhere(eq(rolesTable.name, name))
  }

   private async _deleteWhere(condition: SQL): Promise<void> {
      await this.conn
        .delete(rolesTable)
        .where(condition)
  }
}
