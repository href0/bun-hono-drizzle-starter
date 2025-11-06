import { menusTable } from "../../models/menu.model";
import { permissionsTable } from "../../models/permission.model";
import { rolesTable } from "../../models/role.model";
import { subMenuTable } from "../../models/sub-menu.model";
import { usersTable } from "../../models/user.model";
import { creator, updater } from "../../db/aliases";

export const USER_SELECT = {
  id : usersTable.id,
  name : usersTable.name,
  email : usersTable.email,
  updatedAt : usersTable.updatedAt,
  createdAt : usersTable.createdAt,
}



export const MENU_SELECT = {
  id : menusTable.id,
  parentId : menusTable.parentId,
  name : menusTable.name,
  icon : menusTable.icon,
  url : menusTable.url,
  isActive : menusTable.isActive,
  updatedAt : menusTable.updatedAt,
  createdAt : menusTable.createdAt,
  createdBy : {
    id: creator.id,
    name: creator.name,
    email: creator.email,
  },
  updatedBy : {
    id: updater.id,
    name: updater.name,
    email: updater.email,
  }
}

export const SUB_MENU_SELECT = {
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

export const PERMISSION_SELECT = {
  id : permissionsTable.id,
  name : permissionsTable.name,
  description : permissionsTable.description,
  api : permissionsTable.api,
  updatedAt : permissionsTable.updatedAt,
  createdAt : permissionsTable.createdAt,
}