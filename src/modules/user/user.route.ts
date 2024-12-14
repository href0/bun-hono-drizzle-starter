import { createRoute } from "@hono/zod-openapi"
import { OpenAPIResponseHelper } from "../../utils/helpers/open-api-response.helper"
import { createUserSchema, responseUserSchema, updatePasswordUserSchema, updateUserSchema, userParamSchema, userQuerySchema } from "./user.schema"

class UserRoute {
  public readonly findAll = createRoute({
    method: 'get',
    path: '/',
    tags : ['Users'],
    request : {
      query : userQuerySchema
    },
    responses:OpenAPIResponseHelper.createSuccessWithPaginationResponse(responseUserSchema, 'Get all user with pagination')
  })
  
  public readonly findOne = createRoute({
    method: 'get',
    path: '/{id}',
    tags : ['Users'],
    request: {
      params: userParamSchema,
    },
    responses: OpenAPIResponseHelper.createSuccessResponse(responseUserSchema, 'Get User by ID'),
  })
  
  public readonly create = createRoute({
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
  })
  
  public readonly update = createRoute({
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
  })
  
  public readonly updatePassword = createRoute({
    method: 'patch',
    path: '/{id}/password',
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
  })
  
  public readonly remove = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Users'],
    request: {
      params: userParamSchema,
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(null, 'User deleted successfully')
  })
}

export const userRoute = new UserRoute()

