import { z } from '@hono/zod-openapi'
import { queryPaginationSchema } from '../../utils/schemas/pagination.schema'

export const responseUserSchema = z.object({
  id: z.number().openapi({ example : 1 }),
  email: z.string().openapi({ example : "john@gmail.com" }),
  name: z.string().openapi({ example : "john doe" }),
  createdAt: z.date().openapi({ example : "2024-10-28" }),
  updatedAt: z.date().nullable().openapi({ example : "2024-10-28" }),
})

export const createUserSchema = z.object({
  email: z.string().email().openapi({ example : "john@gmail.com" }),
  name: z.string().min(5).openapi({ example : "john doe" }),
  password: z.string().min(6).openapi({ example : "password" }),
  roleId: z.number().optional().openapi({ example : 2 }),
}).openapi('Create User')

export const updateUserSchema = z.object({
  email: z.string().email().openapi({ example : "john@gmail.com" }),
  name: z.string().min(5).openapi({ example : "john doe" }),
}).openapi('Update User')

export const updatePasswordUserSchema = z.object({
  password: z.string().min(6).openapi({ example : "password" }),
}).openapi('Update Password')

export const userParamSchema =  z.object({
  id: z.coerce.number().openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: 1,
  }),
})

export const userQuerySchema = queryPaginationSchema.extend({
  email : z.string().email().optional().openapi({}),
  name : z.string().optional().openapi({})
})