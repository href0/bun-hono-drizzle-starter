import { responseJson } from '../../../utils/helpers/response.helper';
import { OpenAPIHono } from '@hono/zod-openapi';
import { defaultHookConfig } from '../../../config/app.config';
import { permissionRoute } from './permission.route';
import { permissionService } from './permission.service';

const permissionHandler = new OpenAPIHono({ defaultHook: defaultHookConfig() })

permissionHandler.openapi(permissionRoute.create, async (c) => {
  const body = c.req.valid('json')
  const sub = c.get('jwtPayload').sub
  const result = await permissionService.create({...body, createdBy: sub})
  return responseJson.CREATED(c, result, 'Permission created successfully')
})

permissionHandler.openapi(permissionRoute.findAll, async (c) => {
  const { rows, pagination } = await permissionService.findAll(c.req.valid('query'))
  return responseJson.OK(c, rows, 'Permissions retrieved successfully', pagination)
})

permissionHandler.openapi(permissionRoute.findOne, async (c) => {
  const { id } = c.req.valid('param')
  const user = await permissionService.findOne(id)
  return responseJson.OK(c, user, 'Permission found')
})

permissionHandler.openapi(permissionRoute.update, async (c) => {
  const body = c.req.valid('json')
  const id = c.req.valid('param').id
  const sub = c.get('jwtPayload').sub
  const result = await permissionService.update(id, {...body, updatedBy: sub})
  return responseJson.OK(c, result, 'Permission updated successfully')
})

permissionHandler.openapi(permissionRoute.remove, async (c) => {
  const id = c.req.valid('param').id
  await permissionService.remove(id)
  return responseJson.OK(c, null, "Permission deleted successfully")
})

export default permissionHandler
