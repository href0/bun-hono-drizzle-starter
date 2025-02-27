import { usersTable } from "../../models/user.model"
import { InsertUser, SelectUser, UpdateUser, UserQuerySchema } from "./user.type"
import { dynamicQueryWithPagination, PaginatedResult } from "../../utils/helpers/pagination.helper";
import { and, desc, ilike, SQL } from "drizzle-orm";
import { NotFoundError } from "../../utils/errors/http.error";
import { USER_SELECT } from "../../utils/constants/select.constant";
import { userRepository } from "./user.repository";

class UserServie {
  public async create(request: InsertUser): Promise<SelectUser> {
    const newUser = await userRepository.create(request)
    return newUser
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

  public async findOneByEmail(email: string): Promise<SelectUser> {
    const result = await userRepository.findByEmail(email)
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

  public async updateByEmail(email: string, request: UpdateUser): Promise<SelectUser> {
    const result = await userRepository.findByEmail(email)
    if(!result) throw new NotFoundError('User Not Found')
    const valueToUpdate: UpdateUser = {
      name : request.name,
    }
    const updated = await userRepository.updateByEmail(email, valueToUpdate)

    return updated
  }

  public async updatePassword(id: number, password: string): Promise<SelectUser> {
    const user = await userRepository.findById(id)
    if(!user) throw new NotFoundError('User Not Found')
    const updated = await userRepository.updatePassword(id, password)
    return updated
  }
  
  public async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    const user = await userRepository.findById(id)
    if(!user) throw new NotFoundError('User Not Found')
    await userRepository.updateRefreshToken(id, refreshToken)
  }

  public async remove(id: number): Promise<void> {
    await userRepository.delete(id)
  }

  public async removeByEmail(email: string): Promise<void> {
    await userRepository.deleteByEmail(email)
  }
}

export const userService = new UserServie()