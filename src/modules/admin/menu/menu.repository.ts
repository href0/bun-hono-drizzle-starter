import { aliasedTable, eq, SQL } from "drizzle-orm"
import { db } from "../../../config/db.config"
import { menusTable as table } from "../../../models/menu.model"
import { InsertMenu as Insert, Menu, ResponseMenu, SelectMenu as Select } from "./menu.type"
import { creator, updater } from "../../../db/aliases"

import { MENU_SELECT } from "../../../utils/constants/select.constant"

class MenuRepository {
  public async create(data: Insert): Promise<Menu> {
    const [ { id } ] = await db.insert(table).values(data).returning({ id: table.id })
    const result = await this.findById(id)
    return result!
  }

  public async findById(id: number): Promise<Menu | null> {
    const [ result ] = await db
      .select(MENU_SELECT)
      .from(table)
      .leftJoin(creator, eq(creator.id, table.createdBy))
      .leftJoin(updater, eq(updater.id, table.updatedBy))
      .where(eq(table.id, id))
    return result
  }

  public async findByName(name: string): Promise<Menu | null> {
    const [ result ] = await db
      .select(MENU_SELECT)
      .from(table)
      .leftJoin(creator, eq(creator.id, table.createdBy))
      .leftJoin(updater, eq(updater.id, table.updatedBy))
      .where(eq(table.name, name))
    return result
  }

  public async update(id: number, data: Partial<Insert>): Promise<Menu> {
    await db
      .update(table)
      .set(data)
      .where(eq(table.id, id))

    const result = await this.findById(id)
    return result!
  }

  public async delete(id: number): Promise<void> {
    await this._deleteWhere(eq(table.id, id))
  }

  public async deleteByName(name: string): Promise<void> {
    await this._deleteWhere(eq(table.name, name))
  }

  private async _deleteWhere(condition: SQL): Promise<void> {
    await db
      .delete(table)
      .where(condition)
  }

  public async tes() {
    const cccc  = await db.query.menusTable.findMany({
      with: {
        createdByUser: true,
        updatedByUser: true
      },
    })
  }
}

export const menuRepository = new MenuRepository()