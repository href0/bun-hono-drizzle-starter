import { createRoute, z } from "@hono/zod-openapi"
import { OpenAPIResponseHelper } from "../../utils/helpers/open-api-response.helper"
import { menuSchemaCreate, menuSchemaParams, menuSchemaQuery, menuSchemaResponse, menuSchemaUpdate } from "./menu.schema"
import { securityBearerSchema } from "../../utils/schemas/security-bearer.schema"

class MenuRoute {
  public readonly findAll = createRoute({
    method: 'get',
    path: '/',
    tags : ['Menus'],
    security: securityBearerSchema,
    request : {
      query : menuSchemaQuery
    },
    responses:OpenAPIResponseHelper.createSuccessWithPaginationResponse(menuSchemaResponse, 'Get all menus with pagination')
  })
  
  public readonly findOne = createRoute({
    method: 'get',
    path: '/{id}',
    tags : ['Menus'],
    security: securityBearerSchema,
    request: {
      params: menuSchemaParams,
    },
    responses: OpenAPIResponseHelper.createSuccessResponse(menuSchemaResponse, 'Get Menu by ID'),
  })
  
  public readonly create = createRoute({
    method: 'post',
    path: '/',
    tags: ['Menus'],
    security: securityBearerSchema,
    request: {
      body: {
        content: {
          'application/json': {
            schema: menuSchemaCreate
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createCreatedResponse(menuSchemaResponse, 'Menu created successfully')
  })
  
  public readonly update = createRoute({
    method: 'put',
    path: '/{id}',
    tags: ['Menus'],
    security: securityBearerSchema,
    request: {
      params : menuSchemaParams,
      body: {
        content: {
          'application/json': {
            schema: menuSchemaUpdate
          }
        }
      }
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(menuSchemaResponse, 'Menu updated successfully')
  })
  
  public readonly remove = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Menus'],
    security: securityBearerSchema,
    request: {
      params: menuSchemaParams,
    },
    responses : OpenAPIResponseHelper.createSuccessResponse(null, 'Menu deleted successfully')
  })
}

export const menuRoute = new MenuRoute()

