import { z } from '@hono/zod-openapi'
import { queryPaginationSchema } from '../../../utils/schemas/pagination.schema'

const basePermissionSchema = z.object({
  name: z.string().max(30).min(1).openapi({ example: "View" }),
  description: z.string().max(100).nullable().optional().openapi({ example: "View product" }),
  api: z.string().max(100).min(1).openapi({ example: "/products" }),
})

export const permissionSchemaResponse = basePermissionSchema.extend({
  id: z.number().openapi({ example : 1 }),
})

export const permissionSchemaCreate = basePermissionSchema
  .extend({})
  .openapi('Create Permission')

export const permissionSchemaUpdate = basePermissionSchema
  .omit({})
  .extend({})
  .openapi('Update Permission')

export const permissionSchemaParams =  z.object({
  id: z.coerce.number().openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: 1,
  }),
})

export const permissionSchemaQuery = queryPaginationSchema.extend({
  name : z.string().optional().openapi({}),
})