import { and, desc, ilike, SQL } from "drizzle-orm"
import { ConflictError, NotFoundError } from "../../../utils/errors/http.error"
import { dynamicQueryWithPagination, PaginatedResult } from "../../../utils/helpers/pagination.helper"
import { permissionsTable } from "../../../models/permission.model"
import { PERMISSION_SELECT } from "../../../utils/constants/select.constant"
import { InsertPermission, PermissionQuerySchema, SelectPermission, UpdatePermission } from "./permission.type"
import { permissionRepository } from "./permission.repository"

class PermissionService {
  public async create(request: InsertPermission): Promise<SelectPermission> {
    const isExists = await permissionRepository.findByName(request.name)
    if(isExists) throw new ConflictError('Permission Already Exists!')

    return permissionRepository.create(request)
  }

  public async findAll(querySchema: PermissionQuerySchema): Promise<PaginatedResult<SelectPermission>> {
    const conditions = [];
    const searchConditions: SQL<unknown>[] = [];
    if (querySchema.name?.trim()) {
      searchConditions.push(ilike(permissionsTable.name, `%${querySchema.name}%`));
    }

    if (searchConditions.length > 0) {
      conditions.push(and(...searchConditions));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result  = await dynamicQueryWithPagination(permissionsTable, {
      page: querySchema.page, 
      pageSize :querySchema.pageSize, 
      orderByColumn : desc(permissionsTable.updatedAt),
      where : whereClause,
      select: PERMISSION_SELECT
    })
    return result
  }

  public async findOne(id: number): Promise<SelectPermission> {
    const result = await permissionRepository.findById(id)
    if(!result) throw new NotFoundError('Permission Not Found')
    return result
  }

  public async update(id: number, request: UpdatePermission): Promise<SelectPermission> {
    const check = await permissionRepository.findById(id)
    if(!check) throw new NotFoundError('Permission Not Found')

    return permissionRepository.update(id, request)
  }

  public async remove(id: number): Promise<void> {
    await permissionRepository.delete(id)
  }

  public async removeByName(name: string): Promise<void> {
    await permissionRepository.deleteByName(name)
  }
}

export const permissionService = new PermissionService()