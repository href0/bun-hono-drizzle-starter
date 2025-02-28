import { and, desc, ilike, SQL } from "drizzle-orm"
import { ConflictError, NotFoundError } from "../../utils/errors/http.error"
import { dynamicQueryWithPagination, PaginatedResult } from "../../utils/helpers/pagination.helper"
import { roleRepository } from "./role.repository"
import { InsertRole, RoleQuerySchema, SelectRole, UpdateRole } from "./role.type"
import { rolesTable } from "../../models/role.model"
import { ROLE_SELECT } from "../../utils/constants/select.constant"

class RoleService {
  public async create(request: InsertRole): Promise<SelectRole> {
    const isExists = await roleRepository.findByName(request.name)
    if(isExists) throw new ConflictError('Role Already Exists!')

    return roleRepository.create(request)
  }

  public async findAll(querySchema: RoleQuerySchema): Promise<PaginatedResult<SelectRole>> {
    const conditions = [];
    const searchConditions: SQL<unknown>[] = [];
    if (querySchema.name?.trim()) {
      searchConditions.push(ilike(rolesTable.name, `%${querySchema.name}%`));
    }

    if (searchConditions.length > 0) {
      conditions.push(and(...searchConditions));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result  = await dynamicQueryWithPagination(rolesTable, {
      page: querySchema.page, 
      pageSize :querySchema.pageSize, 
      orderByColumn : desc(rolesTable.updatedAt),
      where : whereClause,
      select: ROLE_SELECT
    })
    return result
  }

  public async findOne(id: number): Promise<SelectRole> {
    const role = await roleRepository.findById(id)
    if(!role) throw new NotFoundError('Role Not Found')
    return role
  }

  public async update(id: number, request: UpdateRole): Promise<SelectRole> {
    const role = await roleRepository.findById(id)
    if(!role) throw new NotFoundError('Role Not Found')

    return roleRepository.update(id, request)
  }

  public async remove(id: number): Promise<void> {
    await roleRepository.delete(id)
  }

  public async removeByName(name: string): Promise<void> {
    await roleRepository.deleteByName(name)
  }

}

export const roleService = new RoleService()