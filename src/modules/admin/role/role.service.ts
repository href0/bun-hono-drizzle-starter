import { and, desc, ilike, SQL } from "drizzle-orm"
import { ConflictError, NotFoundError } from "../../../utils/errors/http.error"
import { dynamicQueryWithPagination, PaginatedResult } from "../../../utils/helpers/pagination.helper"
import { CreateRoleDTO, RoleInsert, RoleQuery, RoleResponse, RoleUpdate, UpdateRoleDTO } from "./role.type"
import { rolesTable } from "../../../models/role.model"
import { ROLE_SELECT, RoleRepository } from "./role.repository"

export class RoleService {

  constructor(private readonly roleRepository: RoleRepository) {}

  public async create(request: CreateRoleDTO, createdBy: number): Promise<RoleResponse> {
    const isExists = await this.roleRepository.findByName(request.name)
    if(isExists) throw new ConflictError('Role Already Exists!')

    const payload: RoleInsert = {
      ...request,
      createdBy,
      createdAt: new Date(),
    }

    return this.roleRepository.create(payload)
  }

  public async findAll(querySchema: RoleQuery): Promise<PaginatedResult<RoleResponse>> {
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
      select: {
        id : rolesTable.id,
        name : rolesTable.name,
        createdBy: rolesTable.createdBy,
        updatedAt : rolesTable.updatedAt,
        createdAt : rolesTable.createdAt,
      }
    })
    return result
  }

  public async findOne(id: number): Promise<RoleResponse> {
    const result = await this.roleRepository.findById(id)
    if(!result) throw new NotFoundError('Role Not Found')
    return result
  }

  public async update(id: number, request: UpdateRoleDTO, updatedBy: number): Promise<RoleResponse> {
    const check = await this.roleRepository.findById(id)
    if(!check) throw new NotFoundError('Role Not Found')
    
    const payload: RoleUpdate = {
      ...request,
      updatedBy,
      updatedAt: new Date()
    }

    return this.roleRepository.update(id, payload)
  }

  public async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id)
  }

  public async removeByName(name: string): Promise<void> {
    await this.roleRepository.deleteByName(name)
  }
}