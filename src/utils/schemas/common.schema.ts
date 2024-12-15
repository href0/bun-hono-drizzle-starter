import { z } from 'zod'

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

export const successResponseSchema = <T extends z.ZodType>(dataSchema: T | null = null, message: string = 'success', metaSchemaType: z.ZodType = metaSchema) => {
  return z.object({
    message: z.string().openapi({ example: message }),
    data: dataSchema ?? z.null(),
    meta: metaSchemaType,
  })
}


export const successResponseWithPaginationSchema = <T extends z.ZodType>(dataSchema: T) => {
  return successResponseSchema(dataSchema, 'success', metaSchemaWithPagination)
}

export const errorResponseSchema = z.object({
  message : z.string(),
  errors : z.any().optional(),
  meta : metaSchema,
  stack : z.string().optional()
})



