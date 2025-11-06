import { db } from "../config/db.config"
import { menusTable } from "../models/menu.model"
import { InsertMenu } from "../modules/admin/menu/menu.type"
import { initUserSystem } from "./initial-user-system"

const MENUS = [
  {
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    url: '/',
    childs: []
  },
  {
    name: 'Master',
    icon: 'Package',
    url: '#',
    childs: [
      {
        name: 'Products',
        icon: 'ShoppingBag',
        url: '/master/products',
        apiEndpoint: '/api/master/products',
        apiDescription: 'Manage product catalog'
      },
      {
        name: 'Warehouses',
        icon: 'Warehouse',
        url: '/master/warehouses',
        apiEndpoint: '/api/master/warehouses',
        apiDescription: 'Manage warehouse locations'
      },
    ]
  },
  {
    name: 'Admin',
    icon: 'Shield',
    url: '#',
    childs: [
      {
        name: 'Menu Management',
        icon: 'List',
        url: '/admin/menus',
        apiEndpoint: '/api/admin/menus',
        apiDescription: 'Manage application menus'
      },
      {
        name: 'Role Management',
        icon: 'Users',
        url: '/admin/roles',
        apiEndpoint: '/api/admin/roles',
        apiDescription: 'Manage user roles'
      },
      {
        name: 'User Management',
        icon: 'User',
        url: '/admin/users',
        apiEndpoint: '/api/admin/users',
        apiDescription: 'Manage user accounts'
      },
      {
        name: 'Role Access Menu Management',
        icon: 'Lock',
        url: '/admin/role-access-menu',
        apiEndpoint: '/api/admin/role-access-menu',
        apiDescription: 'Setup role access menu'
      },
    ]
  },
  {
    name: 'User',
    icon: 'User',
    url: '#',
    childs: [
      {
        name: 'Profile',
        icon: 'UserCircle',
        url: '/user/profile',
        apiEndpoint: '/api/user/profile',
        apiDescription: 'User profile settings'
      },
    ]
  },
  {
    name: 'Settings',
    icon: 'Settings',
    url: '/settings',
    childs: []
  }
]

export const initMenu = async () => {
  await db.transaction(async (trx) => {
    
    const superAdminId =  await initUserSystem()
    const allChilds: InsertMenu[] = []

    for(const menu of MENUS) {
      const [ insertMenu ] = await trx
        .insert(menusTable)
        .values({
          name: menu.name,
          icon: menu.icon,
          isActive: true,
          url: menu.url,
          createdBy: superAdminId,
        })
        .returning({ id: menusTable.id })
      
      for(const child of menu.childs) {
        allChilds.push({
          parentId: insertMenu.id,
          name: child.name,
          icon: child.icon,
          isActive: true,
          url: child.url,
          createdBy: superAdminId,
          apiEndpoint: child.apiEndpoint,
          apiDescription: child.apiDescription,
        })
      }
    }

    await trx.insert(menusTable)
    .values(allChilds)
  })
  


}
