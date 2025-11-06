import { createRoute, z } from "@hono/zod-openapi"
import { OpenAPIResponseHelper } from "../../../utils/helpers/open-api-response.helper"
import { createRoleSchema, roleSchemaParams, roleQuerySchema, roleResponseSchema, updateRoleSchema, roleDetailResponseSchema } from "./role.schema"
import { securityBearerSchema } from "../../../utils/schemas/security-bearer.schema"
const TAGS = ['Roles']

class RoleRoute {
  public readonly findAll = createRoute({
    method: 'get',
    path: '/',
    tags : TAGS,
    security: securityBearerSchema,
    request : {
      query : roleQuerySchema
    },
    responses:OpenAPIResponseHelper.createSuccessWithPaginationResponse(roleResponseSchema, 'Get all roles with pagination')
  })
  
  public readonly findOne = createRoute({
    method: 'get',
    path: '/{id}',
    tags : TAGS,
    security: securityBearerSchema,
    request: {
      params: roleSchemaParams,
    },
    responses: OpenAPIResponseHelper.createSuccessResponse(roleDetailResponseSchema, 'Get Role by ID'),
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
            schema: createRoleSchema
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createCreatedResponse(roleResponseSchema, 'Role created successfully')
  })
  
  public readonly update = createRoute({
    method: 'put',
    path: '/{id}',
    tags: TAGS,
    security: securityBearerSchema,
    request: {
      params : roleSchemaParams,
      body: {
        content: {
          'application/json': {
            schema: updateRoleSchema
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(roleDetailResponseSchema, 'Role updated successfully')
  })
  
  public readonly remove = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: TAGS,
    security: securityBearerSchema,
    request: {
      params: roleSchemaParams,
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(null, 'Role deleted successfully')
  })
}

export const roleRoute = new RoleRoute()

