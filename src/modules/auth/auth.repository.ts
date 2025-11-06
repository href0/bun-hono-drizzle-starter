import { usersTable } from '../../models/user.model'
import { db } from '../../config/db.config'
import { USER_SELECT } from '../../utils/constants/select.constant'
import { UserResponse, User, UserInsert } from '../admin/user/user.type'
import { SignUpDTO } from './auth.type'
import { and, eq } from 'drizzle-orm'

export class AuthRepository {
  constructor(private readonly conn: typeof db = db) {}

  async signUp(data: SignUpDTO): Promise<UserResponse> {
    const payload: UserInsert = {
      email: data.email,
      name: data.name,
      password: data.password,
      createdAt: new Date(),
      createdBy: 1, // system
    }
    const [user] = await this.conn.insert(usersTable).values(payload).returning(USER_SELECT)
    return user
  }

  async signIn(email: string): Promise<User | null> {
    const [ user ] = await this.conn
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    
    return user
  }

  async getRefreshToken(email: string, refreshToken: string): Promise<{ id: number, refreshToken: string|null } | null> {
    const [ result ] = await db
      .select({ id: usersTable.id, refreshToken: usersTable.refreshToken })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email),
          eq(usersTable.refreshToken, refreshToken),
        )
      )
    
    return result
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const [ user ] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))

    return user !== undefined
  }

}