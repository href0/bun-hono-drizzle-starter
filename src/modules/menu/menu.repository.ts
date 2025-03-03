import { eq, SQL } from "drizzle-orm"
import { db } from "../../config/db.config"
import { menusTable } from "../../models/menu.model"
import { MENU_SELECT } from "../../utils/constants/select.constant"
import { InsertMenu, SelectMenu } from "./menu.type"

class MenuRepository {
  public async create(data: InsertMenu): Promise<SelectMenu> {
    const [ created ] = await db.insert(menusTable).values(data).returning(MENU_SELECT)
    return created
  }

  public async findById(id: number): Promise<SelectMenu | null> {
    const [ result ] = await db
                          .select(MENU_SELECT)
                          .from(menusTable)
                          .where(eq(menusTable.id, id))
    return result
  }

  public async findByName(name: string): Promise<SelectMenu | null> {
    const [ result ] = await db
                          .select(MENU_SELECT)
                          .from(menusTable)
                          .where(eq(menusTable.name, name))
    return result
  }

  public async update(id: number, data: Partial<InsertMenu>): Promise<SelectMenu> {
    const [ updated ] = await db
                              .update(menusTable)
                              .set(data)
                              .where(eq(menusTable.id, id))
                              .returning(MENU_SELECT)
    return updated
  }

  // public async delete(id: number): Promise<void> {
  //   await db.delete(menusTable).where(eq(menusTable.id, id))
  // }

  public async delete(id: number): Promise<void> {
    await this._deleteWhere(eq(menusTable.id, id))
  }

  public async deleteByName(name: string): Promise<void> {
    await this._deleteWhere(eq(menusTable.name, name))
  }

  private async _deleteWhere(condition: SQL): Promise<void> {
    await db
      .delete(menusTable)
      .where(condition)
  }
}

export const menuRepository = new MenuRepository()