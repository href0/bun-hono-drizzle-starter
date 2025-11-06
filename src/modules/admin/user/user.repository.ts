import { eq, getTableColumns, sql, SQL } from 'drizzle-orm'
import { usersTable } from '../../../models/user.model'
import { db } from '../../../config/db.config'
import { UserInsert, UserResponse, UserUpdate } from './user.type'
import { USER_SELECT } from '../../../utils/constants/select.constant'
import { hashPassword } from '../../../utils/helpers/common.helper'
import { rolesTable } from '../../../models/role.model'
import { creator } from '../../../db/aliases'


export class UserRepository {

  constructor(private readonly conn = db) {}

  public async insert(data: UserInsert): Promise<UserResponse> {

    const [result] = await db.insert(usersTable).values(data).returning(USER_SELECT)
    return result
  }

  public async findById(id: number) {
    const [user] = await this.conn
      .select({
        ...getTableColumns(usersTable),
        role: { ...getTableColumns(rolesTable) },
        createdByUser: {
          id: creator.id,
          name: creator.name,
        }
      })
      .from(usersTable)
      .leftJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
      .leftJoin(creator, eq(usersTable.createdBy, creator.id))
      .where(eq(usersTable.id, id))
      .limit(1)

    return user
  }

  public async findByEmail(email: string): Promise<UserResponse | null> {
    const [user] = await this.conn.select(USER_SELECT).from(usersTable).where(eq(usersTable.email, email))
    return user
  }

  public async update(id: number, data: UserUpdate): Promise<UserResponse> {
    return this._updateWhere(eq(usersTable.id, id), data)
  }

  public async updateByEmail(email: string, data: UserUpdate): Promise<UserResponse> {
    return this._updateWhere(eq(usersTable.email, email), data)
  }

  public async updatePassword(id: number, password: string, updatedBy: number): Promise<UserResponse> {
    const hashedPassword = await hashPassword(password)
    const [user] = await this.conn
      .update(usersTable)
      .set({ password: hashedPassword, updatedAt: new Date(), updatedBy })
      .where(eq(usersTable.id, id))
      .returning(USER_SELECT)
    return user
  }

  public async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
    await this.conn
      .update(usersTable)
      .set({ refreshToken: refreshToken || sql`NULL` })
      .where(eq(usersTable.id, id))
  }

  public async delete(id: number): Promise<void> {
    await this.conn.delete(usersTable).where(eq(usersTable.id, id))
    await this._deleteWhere(eq(usersTable.id, id))
  }

  public async deleteByEmail(email: string): Promise<void> {
    await this._deleteWhere(eq(usersTable.email, email))
  }

  private async _updateWhere(condition: SQL, data: Partial<UserInsert>): Promise<UserResponse> {
    const [user] = await this.conn
      .update(usersTable)
      .set(data)
      .where(condition)
      .returning(USER_SELECT)
    return user
  }

  private async _deleteWhere(condition: SQL): Promise<void> {
    await this.conn
      .delete(usersTable)
      .where(condition)
  }

}