import { z } from '@hono/zod-openapi'
import { queryPaginationSchema } from '../../utils/schemas/pagination.schema'

export const menuSchemaResponse = z.object({
  id: z.number().openapi({ example : 1 }),
  name: z.string().openapi({ example : "admin" }),
  createdAt: z.date().openapi({ example : "2024-10-28" }),
  updatedAt: z.date().nullable().openapi({ example : "2024-10-28" }),
  // createdBy: z.string().openapi({ example : "2024-10-28" }),
  // updatedBy: z.string().nullable().openapi({ example : "2024-10-28" }),
})

export const menuSchemaCreate = z.object({
  name: z.string().openapi({ example : "users" }),
  icon: z.string().openapi({ example : "fas fa-user" }),
}).openapi('Create menu')

export const menuSchemaUpdate = z.object({
  name: z.string().openapi({ example : "users" }),
  icon: z.string().openapi({ example : "fas fa-user" }),
}).openapi('Update menu')

export const menuSchemaParams =  z.object({
  id: z.coerce.number().openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: 1,
  }),
})

export const menuSchemaQuery = queryPaginationSchema.extend({
  name : z.string().optional().openapi({}),
  icon : z.string().optional().openapi({}),
})