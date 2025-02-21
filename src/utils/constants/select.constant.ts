import { rolesTable } from "../../models/role.model";
import { usersTable } from "../../models/user.model";

export const USER_SELECT = {
  id : usersTable.id,
  name : usersTable.name,
  email : usersTable.email,
  updatedAt : usersTable.updatedAt,
  createdAt : usersTable.createdAt,
}

export const ROLE_SELECT = {
  id : rolesTable.id,
  name : rolesTable.name,
  updatedAt : rolesTable.updatedAt,
  createdAt : rolesTable.createdAt,
}
