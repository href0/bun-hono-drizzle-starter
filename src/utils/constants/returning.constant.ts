import { menusTable } from "../../models/menu.model";
import { permissionsTable } from "../../models/permission.model";
import { rolesTable } from "../../models/role.model";
import { subMenuTable } from "../../models/sub-menu.model";
import { usersTable } from "../../models/user.model";

export const USER_RETURNING = {
  id : usersTable.id,
  name : usersTable.name,
  email : usersTable.email,
  updatedAt : usersTable.updatedAt,
  createdAt : usersTable.createdAt,
}

export const ROLE_RETURNING = {
  id : rolesTable.id,
  name : rolesTable.name,
  createdBy: rolesTable.createdBy,
  updatedAt : rolesTable.updatedAt,
  createdAt : rolesTable.createdAt,
}

export const MENU_RETURNING = {
  id : menusTable.id,
  name : menusTable.name,
  icon : menusTable.icon,
  url : menusTable.url,
  isActive : menusTable.isActive,
  updatedAt : menusTable.updatedAt,
  createdAt : menusTable.createdAt,
  createdBy : menusTable.createdBy,
  updatedBy : menusTable.updatedBy,
}

export const SUB_MENU_RETURNING = {
  id : subMenuTable.id,
  menu: {
    id: menusTable.id,
    name: menusTable.name,
    icon : menusTable.icon,
    url : menusTable.url,
    isActive : menusTable.isActive,
  },
  name : subMenuTable.name,
  icon : subMenuTable.icon,
  url : subMenuTable.url,
  isActive : subMenuTable.isActive,
  updatedAt : subMenuTable.updatedAt,
  createdAt : subMenuTable.createdAt,
}

export const PERMISSION_RETURNING = {
  id : permissionsTable.id,
  name : permissionsTable.name,
  description : permissionsTable.description,
  api : permissionsTable.api,
  updatedAt : permissionsTable.updatedAt,
  createdAt : permissionsTable.createdAt,
}