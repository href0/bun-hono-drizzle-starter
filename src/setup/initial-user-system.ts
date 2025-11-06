import { eq } from "drizzle-orm"
import { db } from "../config/db.config"
import { rolesTable } from "../models/role.model"
import { usersTable } from "../models/user.model"
import { hashPassword } from "../utils/helpers/common.helper"

export const initUserSystem = async (): Promise<number> => {

  const [ check ] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .innerJoin(rolesTable, eq(usersTable.roleId, rolesTable.id))
    .where(eq(usersTable.email, "system@hrefdev.be"))
    .limit(1)

  if(check) return check.id
  
  // Step 1: Create user for superadmin
  const hashedPassword = await hashPassword('password')
  const [ superAdmin ] =  await db.
    insert(usersTable).values({
      email: "system@hrefdev.be",
      name: "system",
      password: hashedPassword,
    })
    .returning({ id: usersTable.id })

  // Step 2: Create Role superadmin
  const [ role ] = await db.insert(rolesTable)
    .values({
      name: 'System',
      isSuperadmin: true,
      createdBy: superAdmin.id
    })
    .returning({ id: rolesTable.id })

  // Step 3: Update user role
  await db
    .update(usersTable)
    .set({
      roleId: role.id
    })
    .where(eq(usersTable.id, superAdmin.id))

  return superAdmin.id
}