import { db } from "../../config/db.config"
import { usersTable } from "../../models/user.model"
import { InsertUser, SelectUser, UpdateUser, UserQuerySchema } from "./user.type"
import { dynamicQueryWithPagination, PaginatedResult } from "../../utils/helpers/pagination.helper";
import { and, desc, ilike, SQL } from "drizzle-orm";
import { NotFoundError } from "../../utils/errors/http.error";
import { hashPassword } from "../../utils/helpers/common.helper";
import { USER_SELECT } from "../../utils/constants/select.constant";
import { userRepository } from "./user.repository";

class UserServie {
  public async create(request: InsertUser): Promise<SelectUser> {
    request.password = await hashPassword(request.password)

    const newUser = await db
    .insert(usersTable)
    .values(request)
    .returning(USER_SELECT)

    return newUser[0]
  }
  
  public async findAll(querySchema: UserQuerySchema): Promise<PaginatedResult<SelectUser>> {
    const conditions = [];
    const searchConditions: SQL<unknown>[] = [];

    if (querySchema.email?.trim()) {
      searchConditions.push(ilike(usersTable.email, `%${querySchema.email}%`));
    }

    if (querySchema.name?.trim()) {
      searchConditions.push(ilike(usersTable.name, `%${querySchema.name}%`));
    }

    if (searchConditions.length > 0) {
      conditions.push(and(...searchConditions));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result  = await dynamicQueryWithPagination(usersTable, {
      page: querySchema.page, 
      pageSize :querySchema.pageSize, 
      orderByColumn : desc(usersTable.updatedAt),
      where : whereClause,
      select: USER_SELECT
    })
    return result
  }

  public async findOne(id: number): Promise<SelectUser> {
    const result = await userRepository.findById(id)
    if(!result) throw new NotFoundError('User Not Found')
    return result
  }

  public async update(id: number, request: UpdateUser): Promise<SelectUser> {
    const result = await userRepository.findById(id)
    if(!result) throw new NotFoundError('User Not Found')
    const valueToUpdate: UpdateUser = {
      email : request.email,
      name : request.name,
    }
    const updated = await userRepository.update(id, valueToUpdate)

    return updated
  }

  public async updatePassword(id: number, password: string): Promise<SelectUser> {
    const user = await userRepository.findById(id)
    if(!user) throw new NotFoundError('User Not Found')
    const updated = await userRepository.updatePassword(id, password)
    return updated
  }

  public async remove(id: number): Promise<void> {
    await userRepository.delete(id)
  }
}

export const userService = new UserServie()