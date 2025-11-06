import { z } from '@hono/zod-openapi'
import { queryPaginationSchema } from '../../../utils/schemas/pagination.schema'
import { Menu } from './menu.type'

export const menuSchemaResponse = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: "admin" }),
  icon: z.string().openapi({ example: "fas fa-user" }),
  // url: z.string().length(10).default('#').openapi({ example: "test" }),
  url: z.string().default("#").openapi({ example: "test" }),
  isActive: z.boolean().default(false).openapi({ example: false }),
  createdAt: z.date().openapi({ example: "2024-10-28T00:00:00.000Z" }),
  updatedAt: z.date().nullable().openapi({ example: "2024-10-28T00:00:00.000Z" }),
  createdBy: z.object({
    id: z.number().openapi({ example: 1 }),
    email: z.string().openapi({ example: "john@gmail.com" }),
    name: z.string().openapi({ example: "john doe" }),
  }).optional().nullable(),
  updatedBy: z.object({
    id: z.number().openapi({ example: 1 }),
    email: z.string().openapi({ example: "john@gmail.com" }),
    name: z.string().openapi({ example: "john doe" }),
  }).optional().nullable(),
  childs: z.lazy(() => z.array(menuSchemaResponse))
  .optional()
  .openapi({
    type: "array",
    // idealnya pakai $ref ke komponen 'Menu' kalau kamu registrasi via OpenAPIRegistry
    // items: { $ref: "#/components/schemas/Menu" },
  })
}) as z.ZodType<Menu>;

export const menuSchemaCreate = z.object({
  name: z.string().openapi({ example : "users" }),
  icon: z.string().openapi({ example : "fas fa-user" }),
  url: z.string().length(10).default('#').openapi({ example: "test"}),
  isActive: z.boolean().default(false).openapi({ example: false }),
}).openapi('Create menu')

export const menuSchemaUpdate = z.object({
  name: z.string().openapi({ example : "users" }),
  icon: z.string().openapi({ example : "fas fa-user" }),
  url: z.string().length(10).default('#').openapi({ example: "test"}),
  isActive: z.boolean().default(false).openapi({ example: false }),
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

export const menuSchemaUpdateStatus = z.object({
  isActive: z.boolean().default(true),
}).openapi('Update Status Menu')