import { db } from "../config/db.config";
import { permissionsTable } from "../models/permission.model";
import { InsertPermission } from "../modules/admin/permission/permission.type";
import { initUserSystem } from "./initial-user-system";

export const initPermission = async() => {
   const superAdminId =  await initUserSystem() 
   const ADMIN_PERMISSIONS = [
    {
      name: "Menu Management",
      description: "Manage application menus",
      api: '/admin/menu',
      createdBy: superAdminId
    },
    {
      name: "Role Management",
      description: "Manage user roles",
      api: '/admin/role',
      createdBy: superAdminId
    },
    {
      name: "User Management",
      description: "Manage user accounts",
      api: '/admin/user',
      createdBy: superAdminId
    },
    {
      name: "Permission Management",
      description: "Manage role permission by API",
      api: '/admin/permission',
      createdBy: superAdminId
    },
    {
      name: "Role Access Menu Management",
      description: "Manage user role access to menu",
      api: '/admin/role-access-menu',
      createdBy: superAdminId
    },
   ]

   const MASTER_DATA_PERMISSIONS = [
    {
      name: "Products Management",
      description: "Manage product catalog",
      api: '/master/products',
      createdBy: superAdminId
    },
   ]

   const USER_PERMISSIONS = [
    {
      name: "User Profile",
      description: "User profile settings",
      api: '/user/profile',
      createdBy: superAdminId
    },
   ]

   const PERMISSIONS: InsertPermission[] = [
    {
      name: "Dashboard",
      description: "View Dashboard statistic and charts",
      api: '/dashboard',
      createdBy: superAdminId
    },
    ...ADMIN_PERMISSIONS,
    ...MASTER_DATA_PERMISSIONS,
    ...USER_PERMISSIONS
  ]

  await db.insert(permissionsTable).values(PERMISSIONS)
  
}