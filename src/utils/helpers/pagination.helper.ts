import { count, InferSelectModel, SQL } from "drizzle-orm";
import { PgTable, PgColumn } from "drizzle-orm/pg-core";
import { db } from "../../config/db.config";
import { PaginationMeta } from "../types/response.type";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants/app.constant";

// Extended interface untuk dynamic options dengan select columns
export interface DynamicQueryOptions {
  where?: SQL<unknown>;
  page?: number;
  pageSize?: number;
  orderByColumn?: PgColumn | SQL | SQL.Aliased,
  select?: Record<string, PgColumn<any>>
}

// Type untuk result dengan pagination metadata
export interface PaginatedResult<T> {
  rows: T[];
  pagination: PaginationMeta;
}

export async function dynamicQueryWithPagination<
  T extends PgTable<any>,
  TSelect extends Record<string, PgColumn<any>> = {}
>(
  table: T,
  options: Omit<DynamicQueryOptions, 'select'> & { select?: TSelect } = { page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE }
): Promise<PaginatedResult<Pick<InferSelectModel<T>, keyof TSelect & string>>> {
  // Default values
  const currentPage = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? 10;

  // Calculate offset
  const offset = (currentPage - 1) * pageSize;

  // Handle dynamic select
  let baseQuery;
  if (options.select) {
    baseQuery = db.select(options.select).from(table);
  } else {
    baseQuery = db.select().from(table);
  }

  // Count query
  const countQuery = db
    .select({
      count: count(),
    })
    .from(table);

  // Apply where clause if exists
  if (options.where) {
    baseQuery.where(options.where);
    countQuery.where(options.where);
  }

   // Apply sort
  if(options.orderByColumn) {
    baseQuery.orderBy(options.orderByColumn)
  }

   // Apply pagination
  baseQuery.limit(pageSize).offset(offset);
  // Execute queries
  const [data, countResult] = await Promise.all([baseQuery, countQuery]);

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

  return {
    rows: data as any[], // Type casting karena data sudah sesuai dengan selected columns
    pagination: pagination,
  };
}
