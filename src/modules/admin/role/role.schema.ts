import { z } from '@hono/zod-openapi'
import { queryPaginationSchema } from '../../../utils/schemas/pagination.schema'
import { creatorSchema } from '../../../utils/schemas/creator.schema'

export const roleResponseSchema = z.object({
  id: z.number().openapi({ example : 1 }),
  name: z.string().openapi({ example : "admin" }),
  createdAt: z.date().openapi({ example : "2024-10-28" }),
  updatedAt: z.date().nullable().openapi({ example : "2024-10-28" }),
  createdByUser: creatorSchema,
  updatedByUser: creatorSchema,
  // updatedBy: z.string().nullable().openapi({ example : "2024-10-28" }),
})

export const roleDetailResponseSchema = z.object({
  id: z.number().openapi({ example : 1 }),
  name: z.string().openapi({ example : "admin" }),
  createdAt: z.date().openapi({ example : "2024-10-28" }),
  updatedAt: z.date().nullable().openapi({ example : "2024-10-28" }),
  createdByUser: creatorSchema,
  updatedByUser: creatorSchema,
  users: z.array(z.object({
    id: z.number().openapi({ example : 1 }),
    name: z.string().openapi({ example : "john doe" })
  })).default([]),
  // updatedBy: z.string().nullable().openapi({ example : "2024-10-28" }),
})

export const createRoleSchema = z.object({
  name: z.string().openapi({ example : "admin" }),
  isSuperadmin: z.boolean().optional().openapi({ example : false }),
}).openapi('Create Role')

export const updateRoleSchema = z.object({
  name: z.string().openapi({ example : "admin" }),
  isSuperadmin: z.boolean().optional().openapi({ example : false }),
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

export const roleQuerySchema = queryPaginationSchema.extend({
  name : z.string().optional().openapi({}),
})