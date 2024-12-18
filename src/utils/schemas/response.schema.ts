import { z } from "zod"
import { metaSchema, metaSchemaWithPagination } from "./pagination.schema"

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
