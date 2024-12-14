import { eq } from 'drizzle-orm'
import { usersTable } from '../../models/user.model'
import { db } from '../../config/db.config'
import { InsertUser, SelectUser, User } from './user.type'
import { USER_SELECT } from '../../utils/constants/select.constant'
import { hashPassword } from '../../utils/helpers/common.helper'

export class UserRepository {
  async create(data: InsertUser): Promise<User> {
    data.password = await hashPassword(data.password)
    const [user] = await db.insert(usersTable).values(data).returning()
    return user
  }

  async findById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id))
    return user
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))
    return user
  }

  async update(id: number, data: Partial<InsertUser>): Promise<SelectUser> {
    const [user] = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning(USER_SELECT)
    return user
  }

  async updatePassword(id: number, password: string): Promise<SelectUser> {
    const hashedPassword = await hashPassword(password)
    const [user] = await db
      .update(usersTable)
      .set({ password : hashedPassword })
      .where(eq(usersTable.id, id))
      .returning(USER_SELECT)
    return user
  }

  async delete(id: number): Promise<void> {
    await db.delete(usersTable).where(eq(usersTable.id, id))
  }

  async list(limit: number, offset: number): Promise<User[]> {
    return db
      .select()
      .from(usersTable)
      .limit(limit)
      .offset(offset)
  }
}

// Export singleton instance
export const userRepository = new UserRepository()