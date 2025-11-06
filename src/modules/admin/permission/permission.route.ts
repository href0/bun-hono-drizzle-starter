import { createRoute, z } from "@hono/zod-openapi"
import { OpenAPIResponseHelper } from "../../../utils/helpers/open-api-response.helper"
import { securityBearerSchema } from "../../../utils/schemas/security-bearer.schema"
import { permissionSchemaCreate, permissionSchemaParams, permissionSchemaQuery, permissionSchemaResponse, permissionSchemaUpdate } from "./permission.schema"
const TAGS = ['Permissions']

class PermissionRoute {
  public readonly findAll = createRoute({
    method: 'get',
    path: '/',
    tags : TAGS,
    security: securityBearerSchema,
    request : {
      query : permissionSchemaQuery
    },
    responses:OpenAPIResponseHelper.createSuccessWithPaginationResponse(permissionSchemaResponse, 'Get all Permissions with pagination')
  })
  
  public readonly findOne = createRoute({
    method: 'get',
    path: '/{id}',
    tags : TAGS,
    security: securityBearerSchema,
    request: {
      params: permissionSchemaParams,
    },
    responses: OpenAPIResponseHelper.createSuccessResponse(permissionSchemaResponse, 'Get Permission by ID'),
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
            schema: permissionSchemaCreate
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createCreatedResponse(permissionSchemaResponse, 'Permission created successfully')
  })
  
  public readonly update = createRoute({
    method: 'put',
    path: '/{id}',
    tags: TAGS,
    security: securityBearerSchema,
    request: {
      params : permissionSchemaParams,
      body: {
        content: {
          'application/json': {
            schema: permissionSchemaUpdate
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(permissionSchemaResponse, 'Permission updated successfully')
  })
  
  public readonly remove = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: TAGS,
    security: securityBearerSchema,
    request: {
      params: permissionSchemaParams,
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(null, 'Permission deleted successfully')
  })
}

export const permissionRoute = new PermissionRoute()

