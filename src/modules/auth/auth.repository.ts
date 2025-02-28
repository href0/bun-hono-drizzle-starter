import { usersTable } from '../../models/user.model'
import { db } from '../../config/db.config'
import { USER_SELECT } from '../../utils/constants/select.constant'
import { SelectUser, User } from '../user/user.type'
import { SignUpAuthSchema } from './auth.type'
import { eq } from 'drizzle-orm'

class AuthRepository {
  async signUp(data: SignUpAuthSchema): Promise<SelectUser> {
    const [user] = await db.insert(usersTable).values(data).returning(USER_SELECT)
    return user
  }

  async signIn(email: string): Promise<User | null> {
    const [ user ] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
    
    return user
  }
}

export const authRepository = new AuthRepository()