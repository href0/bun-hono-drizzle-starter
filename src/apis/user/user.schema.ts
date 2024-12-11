import { createRoute, z } from '@hono/zod-openapi'
import { OpenAPIResponseHelper } from '../../utils/helpers/open-api-response.helper'
import { queryPaginationSchema } from '../../utils/schemas/common.schema'

export const responseUserSchema = z.object({
  id: z.number().openapi({ example : 1 }),
  name: z.string().openapi({ example : "john doe" }),
  email: z.string().openapi({ example : "john@gmail.com" }),
  createdAt: z.date().openapi({ example : "2024-10-28" }),
  updatedAt: z.date().nullable().openapi({ example : "2024-10-28" }),
})

export const createUserSchema = z.object({
  name: z.string().min(5).openapi({ example : "john doe" }),
  password: z.string().min(6).openapi({ example : "password" }),
  email: z.string().email().openapi({ example : "john@gmail.com" }),
}).openapi('Create')

export const updateUserSchema = z.object({
  name: z.string().min(5).openapi({ example : "john doe" }),
  email: z.string().email().openapi({ example : "john@gmail.com" }),
}).openapi('Update')

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

export const userSchemaRoute = {
  findAll : createRoute({
    method: 'get',
    path: '/',
    tags : ['Users'],
    request : {
      query : userQuerySchema
    },
    responses:OpenAPIResponseHelper.createSuccessWithPaginationResponse(responseUserSchema, 'Get all user with pagination')
  }),
  findOne : createRoute({
    method: 'get',
    path: '/{id}',
    tags : ['Users'],
    request: {
      params: userParamSchema,
    },
    responses: OpenAPIResponseHelper.createSuccessResponse(responseUserSchema, 'Get User by ID'),
  }),
  create : createRoute({
    method: 'post',
    path: '/',
    tags: ['Users'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: createUserSchema
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createCreatedResponse(responseUserSchema, 'User created successfully')
  }),
  update : createRoute({
    method: 'put',
    path: '/{id}',
    tags: ['Users'],
    request: {
      params : userParamSchema,
      body: {
        content: {
          'application/json': {
            schema: updateUserSchema
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(responseUserSchema, 'User updated successfully')
  }),
  updatePassword : createRoute({
    method: 'patch',
    path: '/{id}',
    tags: ['Users'],
    request: {
      params : userParamSchema,
      body: {
        content: {
          'application/json': {
            schema: updatePasswordUserSchema
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(responseUserSchema, 'User password updated successfully')
  }),
  remove : createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Users'],
    request: {
      params: userParamSchema,
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(null, 'User deleted successfully')
  })
}
