import { createRoute, z } from "@hono/zod-openapi"
import { OpenAPIResponseHelper } from "../../../utils/helpers/open-api-response.helper"
import { roleAccessMenuSchemaCreate, roleAccessMenuSchemaParams, roleAccessMenuSchemaQuery, roleAccessMenuSchemaResponse, roleAccessMenuSchemaUpdate } from "./role-access-menu.schema"
import { securityBearerSchema } from "../../../utils/schemas/security-bearer.schema"

class RoleAccessMenuRoute {
  public readonly findAll = createRoute({
    method: 'get',
    path: '/',
    tags : ['RoleAccessMenus'],
    security: securityBearerSchema,
    request : {
      query : roleAccessMenuSchemaQuery
    },
    responses:OpenAPIResponseHelper.createSuccessWithPaginationResponse(roleAccessMenuSchemaResponse, 'Get all roleAccessMenus with pagination')
  })
  
  public readonly findOne = createRoute({
    method: 'get',
    path: '/{id}',
    tags : ['RoleAccessMenus'],
    security: securityBearerSchema,
    request: {
      params: roleAccessMenuSchemaParams,
    },
    responses: OpenAPIResponseHelper.createSuccessResponse(roleAccessMenuSchemaResponse, 'Get RoleAccessMenu by ID'),
  })
  
  public readonly create = createRoute({
    method: 'post',
    path: '/',
    tags: ['RoleAccessMenus'],
    security: securityBearerSchema,
    request: {
      body: {
        content: {
          'application/json': {
            schema: roleAccessMenuSchemaCreate
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createCreatedResponse(roleAccessMenuSchemaResponse, 'RoleAccessMenu created successfully')
  })
  
  public readonly update = createRoute({
    method: 'put',
    path: '/{id}',
    tags: ['RoleAccessMenus'],
    security: securityBearerSchema,
    request: {
      params : roleAccessMenuSchemaParams,
      body: {
        content: {
          'application/json': {
            schema: roleAccessMenuSchemaUpdate
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(roleAccessMenuSchemaResponse, 'RoleAccessMenu updated successfully')
  })
  
  public readonly remove = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['RoleAccessMenus'],
    security: securityBearerSchema,
    request: {
      params: roleAccessMenuSchemaParams,
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(null, 'RoleAccessMenu deleted successfully')
  })
}

export const roleAccessMenuRoute = new RoleAccessMenuRoute()

