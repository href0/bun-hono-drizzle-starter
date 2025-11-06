import { and, count, eq, ilike, inArray, isNull, SQL } from "drizzle-orm"
import { ConflictError, NotFoundError } from "../../../utils/errors/http.error"
import { DynamicQueryOptions, PaginatedResult } from "../../../utils/helpers/pagination.helper"
import { MENU_SELECT } from "../../../utils/constants/select.constant"
import { InsertMenu, Menu, MenuQuerySchema, ResponseMenu, UpdateMenu } from "./menu.type"
import { menuRepository } from "./menu.repository"
import { menusTable } from "../../../models/menu.model"
import { db } from "../../../config/db.config"
import { PaginationMeta } from "../../../utils/types/response.type"
import { creator, updater } from "../../../db/aliases"

class MenuService {
  public async create(request: InsertMenu): Promise<Menu> {
    const isExists = await menuRepository.findByName(request.name)
    if(isExists) throw new ConflictError('Menu Already Exists!')

    return menuRepository.create(request)
  }

  public async findAll(querySchema: MenuQuerySchema): Promise<PaginatedResult<ResponseMenu>> {
    const conditions = [];
    const searchConditions: SQL<unknown>[] = [];
    if (querySchema.name?.trim()) {
      searchConditions.push(ilike(menusTable.name, `%${querySchema.name}%`));
    }

    searchConditions.push(isNull(menusTable.parentId))

    if (searchConditions.length > 0) {
      conditions.push(and(...searchConditions));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const currentPage = Math.max(1, querySchema.page ?? 1);
    const pageSize = querySchema.pageSize ?? 10;
  
    // Calculate offset
    const offset = (currentPage - 1) * pageSize;

    const parentsQue = db
          .select(MENU_SELECT)
          .from(menusTable)
          .leftJoin(creator, eq(creator.id, menusTable.createdBy))
          .leftJoin(updater, eq(updater.id, menusTable.updatedBy))
          .where(whereClause)
          .limit(pageSize).offset(offset)

    const countQue = db
          .select({ count: count() })
          .from(menusTable)
          .leftJoin(creator, eq(creator.id, menusTable.createdBy))
          .leftJoin(updater, eq(updater.id, menusTable.updatedBy))
          .where(whereClause)
          
   
    const [ parents, countResult ] = await Promise.all([
      parentsQue,
      countQue,
    ])

    const totalCount = Number(countResult[0].count);
    const totalPages = Math.ceil(totalCount / pageSize);

    const pagination: PaginationMeta = {
      totalCount,
      currentPage,
      pageSize,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };


    const parentIds: number[] = []
    const parentsObj: Record<number, Menu> = {}
    parents.forEach(item => {
      parentIds.push(item.id)
      parentsObj[item.id] = {
        ...item,
        childs: []
      }
    })

    // parentIds.length === 0) return
    const childs = await db
      .select(MENU_SELECT)
      .from(menusTable)
      .leftJoin(creator, eq(creator.id, menusTable.createdBy))
      .leftJoin(updater, eq(updater.id, menusTable.updatedBy))
      .where(inArray(menusTable.parentId, parentIds))

    for(const child of childs) {
      if(child.parentId && parentsObj[child.parentId]) {
        parentsObj[child.parentId].childs?.push(child)
      }
    } 

    const results = {
      rows: Object.values(parentsObj),
      pagination
    }
      
    return results
    // const result  = await dynamicQueryWithPagination(menusTable, {
    //   page: querySchema.page, 
    //   pageSize :querySchema.pageSize, 
    //   orderByColumn : desc(menusTable.updatedAt),
    //   where : whereClause,
    //   select: MENU_SELECT,
    // })
    // return result
  }

  private  _findAllBaseQue(options: DynamicQueryOptions) {
    return db
      .select(options.select!)
      .from(menusTable)
      .leftJoin(creator, eq(creator.id, menusTable.createdBy))
      .leftJoin(updater, eq(updater.id, menusTable.updatedBy))
      .where(options.where)
  }

  public async findOne(id: number): Promise<Menu> {
    const result = await menuRepository.findById(id)
    if(!result) throw new NotFoundError('Menu Not Found')
    return result
  }

  public async update(id: number, request: UpdateMenu): Promise<Menu> {
    const result = await menuRepository.findById(id)
    if(!result) throw new NotFoundError('Menu Not Found')

    return menuRepository.update(id, request)
  }

  public async remove(id: number): Promise<void> {
      await menuRepository.delete(id)
    }
  
  public async removeByName(name: string): Promise<void> {
    await menuRepository.deleteByName(name)
  }
}

export const menuService = new MenuService()