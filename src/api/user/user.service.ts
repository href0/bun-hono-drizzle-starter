import { db } from "../../config/db.config"
import { usersTable } from "../../models/user.model"
import { InsertUser, ResponseUser, UpdateUser, UserQuerySchema } from "./user.type"
import { dynamicQueryWithPagination, PaginatedResult } from "../../utils/helpers/pagination.helper";
import { and, desc, ilike, SQL } from "drizzle-orm";
import * as userQuery from "./user.query";
import { NotFoundError } from "../../utils/errors/http.error";
import { hashPassword } from "../../utils/helpers/common.helper";

class UserServie {
  public async create(request: InsertUser): Promise<ResponseUser> {
    request.password = await hashPassword(request.password)

    const newUser = await db
    .insert(usersTable)
    .values(request)
    .returning(userQuery.select())

    return newUser[0]
  }
  
  public async findAll(querySchema: UserQuerySchema): Promise<PaginatedResult<ResponseUser>> {
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
      select: userQuery.select()
    })
    return result
  }

  public async findOne(id: number): Promise<ResponseUser> {
    const result = await db.select(userQuery.select()).from(usersTable).where(userQuery.getById(id))
    if(result.length === 0) throw new NotFoundError('User Not Found')
    return result[0]
  }

  public async update(id: number, request: UpdateUser) {
    const user = await db.select(userQuery.select()).from(usersTable).where(userQuery.getById(id))
    if(user.length === 0) throw new NotFoundError('User Not Found')
    const valueToUpdate: UpdateUser = {
      email : request.email,
      name : request.name,
    }
    const updated = await db
      .update(usersTable)
      .set(valueToUpdate)
      .where(userQuery.getById(id))
      .returning(userQuery.select())

    return updated[0]
  }

  public async updatePassword(id: number, password: string) {
    const user = await db.select(userQuery.select()).from(usersTable).where(userQuery.getById(id))
    if(user.length === 0) throw new NotFoundError('User Not Found')
    const hashedPassword = await hashPassword(password)
    const updated = await db
      .update(usersTable)
      .set({ password : hashedPassword })
      .where(userQuery.getById(id))
      .returning(userQuery.select())

    return updated[0]
  }

  public async remove(id: number): Promise<void> {
    await db.delete(usersTable).where(userQuery.getById(id))
  }
}

export default new UserServie()