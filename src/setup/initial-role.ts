import { db } from "../config/db.config"
import { rolesTable } from "../models/role.model"
import { RoleInsert } from "../modules/admin/role/role.type"
import { initUserSystem } from "./initial-user-system"




export const initRole = async() => {
  const userSytemId =  await initUserSystem()

  const BASE_ROLES: RoleInsert[] = [
    {
      name: 'Superadmin',
      createdBy: userSytemId,
      isSuperadmin: true,
    },
    {
      name: 'Admin',
      createdBy: userSytemId
    },
    {
      name: 'User',
      createdBy: userSytemId
    },
  ]
  await db.insert(rolesTable).values(BASE_ROLES)
}