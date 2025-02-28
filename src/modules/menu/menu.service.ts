import { and, desc, ilike, SQL } from "drizzle-orm"
import { ConflictError, NotFoundError } from "../../utils/errors/http.error"
import { dynamicQueryWithPagination, PaginatedResult } from "../../utils/helpers/pagination.helper"
import { MENU_SELECT } from "../../utils/constants/select.constant"
import { InsertMenu, MenuQuerySchema, SelectMenu, UpdateMenu } from "./menu.type"
import { menuRepository } from "./menu.repository"
import { menusTable } from "../../models/menu.model"

class MenuService {
  public async create(request: InsertMenu): Promise<SelectMenu> {
    const isExists = await menuRepository.findByName(request.name)
    if(isExists) throw new ConflictError('Menu Already Exists!')

    return menuRepository.create(request)
  }

  public async findAll(querySchema: MenuQuerySchema): Promise<PaginatedResult<SelectMenu>> {
    const conditions = [];
    const searchConditions: SQL<unknown>[] = [];
    if (querySchema.name?.trim()) {
      searchConditions.push(ilike(menusTable.name, `%${querySchema.name}%`));
    }

    if (searchConditions.length > 0) {
      conditions.push(and(...searchConditions));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result  = await dynamicQueryWithPagination(menusTable, {
      page: querySchema.page, 
      pageSize :querySchema.pageSize, 
      orderByColumn : desc(menusTable.updatedAt),
      where : whereClause,
      select: MENU_SELECT
    })
    return result
  }

  public async findOne(id: number): Promise<SelectMenu> {
    const result = await menuRepository.findById(id)
    if(!result) throw new NotFoundError('Menu Not Found')
    return result
  }

  public async update(id: number, request: UpdateMenu): Promise<SelectMenu> {
    const result = await menuRepository.findById(id)
    if(!result) throw new NotFoundError('Menu Not Found')

    return menuRepository.update(id, request)
  }

  public async remove(id: number): Promise<void> {
    await menuRepository.delete(id)
  }
}

export const menuService = new MenuService()