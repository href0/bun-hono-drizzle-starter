import { usersTable } from "../../../models/user.model"
import { UserInsert, UpdateUserDTO, UserResponse, CreateUserDTO, UserQuery } from "./user.type"
import { dynamicQueryWithPagination, PaginatedResult } from "../../../utils/helpers/pagination.helper";
import { and, desc, ilike, SQL } from "drizzle-orm";
import { ConflictError, NotFoundError } from "../../../utils/errors/http.error";
import { USER_SELECT } from "../../../utils/constants/select.constant";
import { UserRepository } from "./user.repository";
import { ERROR_MESSAGES } from "../../../utils/constants/error.constant";
import { hashPassword } from "../../../utils/helpers/common.helper";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async create(request: CreateUserDTO, createdBy: number): Promise<UserResponse> {
    const isExists = await this.userRepository.findByEmail(request.email)
    if (isExists) throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
    const hashedPassword = await hashPassword(request.password)

    const payload: UserInsert = {
      ...request, 
      password: hashedPassword,
      createdAt: new Date(), 
      createdBy 
    }

    const newUser = await this.userRepository.insert(payload)
    return newUser
  }
  
  public async getAll(querySchema: UserQuery): Promise<PaginatedResult<UserResponse>> {
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
      select: USER_SELECT,
    })
    return result
  }

  public async getById(id: number) {
    const result = await this.userRepository.findById(id)
    if(!result) throw new NotFoundError('User Not Found')
    return result
  }

  public async getByEmail(email: string): Promise<UserResponse> {
    const result = await this.userRepository.findByEmail(email)
    if(!result) throw new NotFoundError('User Not Found')
    return result
  }

  public async update(id: number, request: UpdateUserDTO, updatedBy: number): Promise<UserResponse> {
    const result = await this.userRepository.findById(id)
    if(!result) throw new NotFoundError('User Not Found')
    const updated = await this.userRepository.update(id, {...request, updatedBy, updatedAt: new Date()})

    return updated
  }

  public async updateByEmail(email: string, request: UpdateUserDTO, updatedBy: number): Promise<UserResponse> {
    const result = await this.userRepository.findByEmail(email)
    if(!result) throw new NotFoundError('User Not Found')
    const updated = await this.userRepository.updateByEmail(email, { ...request, updatedBy, updatedAt: new Date() })

    return updated
  }

  public async updatePassword(id: number, password: string, updatedBy: number): Promise<UserResponse> {
    const user = await this.userRepository.findById(id)
    if(!user) throw new NotFoundError('User Not Found')
    const updated = await this.userRepository.updatePassword(id, password, updatedBy)
    return updated
  }
  
  public async updateRefreshToken(id: number, refreshToken: string | null): Promise<void> {
    const user = await this.userRepository.findById(id)
    if(!user) throw new NotFoundError('User Not Found')
    await this.userRepository.updateRefreshToken(id, refreshToken)
  }

  public async remove(id: number): Promise<void> {
    await this.userRepository.delete(id)
  }

  public async removeByEmail(email: string): Promise<void> {
    await this.userRepository.deleteByEmail(email)
  }
}