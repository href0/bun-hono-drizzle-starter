import { z } from '@hono/zod-openapi'
import { queryPaginationSchema } from '../../utils/schemas/pagination.schema'

export const roleSchemaResponse = z.object({
  id: z.number().openapi({ example : 1 }),
  name: z.string().openapi({ example : "admin" }),
  createdAt: z.date().openapi({ example : "2024-10-28" }),
  updatedAt: z.date().nullable().openapi({ example : "2024-10-28" }),
  // createdBy: z.string().openapi({ example : "2024-10-28" }),
  // updatedBy: z.string().nullable().openapi({ example : "2024-10-28" }),
})

export const roleSchemaCreate = z.object({
  name: z.string().openapi({ example : "admin" }),
  isSuperadmin: z.boolean().openapi({ example : false }),
}).openapi('Create Role')

export const roleSchemaUpdate = z.object({
  name: z.string().openapi({ example : "admin" }),
  isSuperadmin: z.boolean().openapi({ example : false }),
}).openapi('Update Role')

export const roleSchemaParams =  z.object({
  id: z.coerce.number().openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: 1,
  }),
})

export const roleSchemaQuery = queryPaginationSchema.extend({
  name : z.string().optional().openapi({}),
})