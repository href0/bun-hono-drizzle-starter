import { eq, SQL } from 'drizzle-orm'
import { usersTable } from '../../models/user.model'
import { db } from '../../config/db.config'
import { InsertUser, SelectUser } from './user.type'
import { USER_SELECT } from '../../utils/constants/select.constant'
import { hashPassword } from '../../utils/helpers/common.helper'
import { ConflictError } from '../../utils/errors/http.error'
import { ERROR_MESSAGES } from '../../utils/constants/error.constant'

class UserRepository {
  public async create(data: InsertUser): Promise<SelectUser> {
    const isExists = await this.findByEmail(data.email)
    if(isExists) throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
    data.password = await hashPassword(data.password)
    const [user] = await db.insert(usersTable).values(data).returning(USER_SELECT)
    return user
  }

  public async findById(id: number): Promise<SelectUser | null> {
    const [user] = await db.select(USER_SELECT).from(usersTable).where(eq(usersTable.id, id))
    return user
  }

  public async findByEmail(email: string): Promise<SelectUser | null> {
    const [user] = await db.select(USER_SELECT).from(usersTable).where(eq(usersTable.email, email))
    return user
  }

  public async update(id: number, data: Partial<InsertUser>): Promise<SelectUser> {
    return this._updateWhere(eq(usersTable.id, id), data)
  }
  
  public async updateByEmail(email: string, data: Partial<InsertUser>): Promise<SelectUser> {
    return this._updateWhere(eq(usersTable.email, email), data)
  }

  public async updatePassword(id: number, password: string): Promise<SelectUser> {
    const hashedPassword = await hashPassword(password)
    const [user] = await db
      .update(usersTable)
      .set({ password : hashedPassword })
      .where(eq(usersTable.id, id))
      .returning(USER_SELECT)
    return user
  }

  public async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    await db
      .update(usersTable)
      .set({ refreshToken : refreshToken })
      .where(eq(usersTable.id, id))
  }

  public async delete(id: number): Promise<void> {
    await db.delete(usersTable).where(eq(usersTable.id, id))
    await this._deleteWhere(eq(usersTable.id, id))
  }

  public async deleteByEmail(email: string): Promise<void> {
    await this._deleteWhere(eq(usersTable.email, email))
  }

  private async _updateWhere(condition: SQL, data: Partial<InsertUser>): Promise<SelectUser> {
    const [user] = await db
      .update(usersTable)
      .set(data)
      .where(condition)
      .returning(USER_SELECT)
    return user
  }

  private async _deleteWhere(condition: SQL): Promise<void> {
    await db
      .delete(usersTable)
      .where(condition)
  }
}

export const userRepository = new UserRepository()