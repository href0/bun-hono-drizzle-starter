import { usersTable } from '../../models/user.model'
import { db } from '../../config/db.config'
import { USER_SELECT } from '../../utils/constants/select.constant'
import { hashPassword } from '../../utils/helpers/common.helper'
import { SelectUser } from '../user/user.type'
import { SignUpAuthSchema } from './auth.type'

export class AuthRepository {
  async signUp(data: SignUpAuthSchema): Promise<SelectUser> {
    data.password = await hashPassword(data.password)
    const [user] = await db.insert(usersTable).values(data).returning(USER_SELECT)
    return user
  }

  // async signIn(data: SignInAuthSchema): Promise<SelectUser> {
  //   const [user] = await db.insert(usersTable).values(data).returning(USER_SELECT)
  //   return user
  // }
}

// Export singleton instance
export const authRepository = new AuthRepository()