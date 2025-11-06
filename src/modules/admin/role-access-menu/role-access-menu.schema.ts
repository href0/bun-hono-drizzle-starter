import { z } from '@hono/zod-openapi'
import { queryPaginationSchema } from '../../../utils/schemas/pagination.schema'

// Definisikan enum metode HTTP yang valid
const HttpMethod = z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]);

// Buat skema validasi untuk array metode HTTP
const MethodsSchema = z.array(HttpMethod)
  .nonempty() // Memastikan array tidak kosong
  .refine(
    (methods) => {
      // Pastikan tidak ada duplikasi metode
      return new Set(methods).size === methods.length;
    },
    {
      message: "HTTP methods must be unique"
    }
  );


const baseRoleAccessMenuSchema = z.object({
  roleId: z.number().int().positive().openapi({ example: 1 }),
  subMenuId: z.number().int().positive().openapi({ example: 1 }),
  name: z.string().max(30).min(1).openapi({ example: "View" }),
  description: z.string().max(100).optional().openapi({ example: "View product" }),
  url: z.string().max(100).min(1).openapi({ example: "/products" }),
  method: MethodsSchema.openapi({ example: ['GET', 'POST', 'PUT', 'DELETE'] }),
  isActive: z.boolean().default(false).openapi({ example: true }),
})

export const roleAccessMenuSchemaResponse = baseRoleAccessMenuSchema.extend({
  id: z.number().openapi({ example : 1 }),
})

export const roleAccessMenuSchemaCreate = baseRoleAccessMenuSchema.extend({}).openapi('Create Role Access Menu')

export const roleAccessMenuSchemaUpdate = baseRoleAccessMenuSchema.omit({
  roleId: true,
  subMenuId: true
}).extend({}).openapi('Update Role Access Menu')

export const roleAccessMenuSchemaParams =  z.object({
  id: z.coerce.number().openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: 1,
  }),
})

export const roleAccessMenuSchemaQuery = queryPaginationSchema.extend({
  name : z.string().optional().openapi({}),
})

export const roleAccessMenuSchemaUpdateStatus = z.object({
  isActive: z.boolean().default(true),
}).openapi('Update Status Role Access Menu')