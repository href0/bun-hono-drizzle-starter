import { createRoute, z } from "@hono/zod-openapi"
import { OpenAPIResponseHelper } from "../../utils/helpers/open-api-response.helper"
import { roleSchemaCreate, roleSchemaParams, roleSchemaQuery, roleSchemaResponse, roleSchemaUpdate } from "./role.schema"
import { securityBearerSchema } from "../../utils/schemas/security-bearer.schema"

class RoleRoute {
  public readonly findAll = createRoute({
    method: 'get',
    path: '/',
    tags : ['Roles'],
    security: securityBearerSchema,
    request : {
      query : roleSchemaQuery
    },
    responses:OpenAPIResponseHelper.createSuccessWithPaginationResponse(roleSchemaResponse, 'Get all roles with pagination')
  })
  
  public readonly findOne = createRoute({
    method: 'get',
    path: '/{id}',
    tags : ['Roles'],
    security: securityBearerSchema,
    request: {
      params: roleSchemaParams,
    },
    responses: OpenAPIResponseHelper.createSuccessResponse(roleSchemaResponse, 'Get Role by ID'),
  })
  
  public readonly create = createRoute({
    method: 'post',
    path: '/',
    tags: ['Roles'],
    security: securityBearerSchema,
    request: {
      body: {
        content: {
          'application/json': {
            schema: roleSchemaCreate
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createCreatedResponse(roleSchemaResponse, 'Role created successfully')
  })
  
  public readonly update = createRoute({
    method: 'put',
    path: '/{id}',
    tags: ['Roles'],
    security: securityBearerSchema,
    request: {
      params : roleSchemaParams,
      body: {
        content: {
          'application/json': {
            schema: roleSchemaUpdate
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(roleSchemaResponse, 'Role updated successfully')
  })
  
  public readonly remove = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Roles'],
    security: securityBearerSchema,
    request: {
      params: roleSchemaParams,
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(null, 'Role deleted successfully')
  })
}

export const roleRoute = new RoleRoute()

