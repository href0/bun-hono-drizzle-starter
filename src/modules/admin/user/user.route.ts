import { createRoute, z } from "@hono/zod-openapi"
import { OpenAPIResponseHelper } from "../../../utils/helpers/open-api-response.helper"
import { insertUserSchema, userResponseSchema, updatePasswordUserSchema, updateUserSchema, userParamSchema, userQuerySchema, userDetailResponseSchema } from "./user.schema"
import { securityBearerSchema } from "../../../utils/schemas/security-bearer.schema"
const TAGS = ['Users']

class UserRoute {
  public readonly findAll = createRoute({
    method: 'get',
    path: '/',
    tags : TAGS,
    security: securityBearerSchema,
    request : {
      query : userQuerySchema
    },
    responses:OpenAPIResponseHelper.createSuccessWithPaginationResponse(userResponseSchema, 'Get all user with pagination')
  })
  
  public readonly findOne = createRoute({
    method: 'get',
    path: '/{id}',
    tags : TAGS,
    security: securityBearerSchema,
    request: {
      params: userParamSchema,
    },
    responses: OpenAPIResponseHelper.createSuccessResponse(userDetailResponseSchema, 'Get User by ID'),
  })
  
  public readonly create = createRoute({
    method: 'post',
    path: '/',
    tags: TAGS,
    security: securityBearerSchema,
    request: {
      body: {
        content: {
          'application/json': {
            schema: insertUserSchema
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createCreatedResponse(userResponseSchema, 'User created successfully')
  })
  
  public readonly update = createRoute({
    method: 'put',
    path: '/{id}',
    tags: TAGS,
    security: securityBearerSchema,
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
    responses : OpenAPIResponseHelper.createSuccessResponse(userResponseSchema, 'User updated successfully')
  })
  
  public readonly updatePassword = createRoute({
    method: 'patch',
    path: '/{id}/password',
    tags: TAGS,
    security: securityBearerSchema,
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
    responses : OpenAPIResponseHelper.createSuccessResponse(userResponseSchema, 'User password updated successfully')
  })
  
  public readonly remove = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: TAGS,
    security: securityBearerSchema,
    request: {
      params: userParamSchema,
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(null, 'User deleted successfully')
  })
}

export const userRoute = new UserRoute()

