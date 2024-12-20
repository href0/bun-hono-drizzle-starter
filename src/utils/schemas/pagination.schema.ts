import { z } from "zod"

export const queryPaginationSchema = z.object({
  page: z.coerce.number().optional().openapi({ example : 1 }),
  pageSize: z.coerce.number().optional().openapi({ example : 10 }),
})

export const paginationSchema = z.object({
  totalCount: z.number().openapi({ example : 1 }),
  currentPage: z.number().openapi({ example : 10 }),
  pageSize: z.number().openapi({ example : 10 }),
  totalPages: z.number().openapi({ example : 1 }),
  hasNextPage: z.boolean().openapi({ example : true }),
  hasPreviousPage: z.boolean().openapi({ example : false }),
})

export const metaSchema = z.object({
  version : z.string().optional().openapi({ example : "1.0.0" }),
  timestamp : z.date().optional().openapi({ example : new Date("2024-03-21T10:30:00.000Z").toISOString() }),
})

export const metaSchemaWithPagination = z.object({
  version : z.string().optional().openapi({ example : "1.0.0" }),
  timestamp : z.date().optional().openapi({ example : new Date("2024-03-21T10:30:00.000Z").toISOString() }),
  pagination: paginationSchema.optional(),
})