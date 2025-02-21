import { responseJson } from '../../utils/helpers/response.helper';
import { OpenAPIHono } from '@hono/zod-openapi';
import { defaultHookConfig } from '../../config/app.config';
import { roleRoute } from './role.route';
import { roleService } from './role.service';

const roleHandler = new OpenAPIHono({ defaultHook: defaultHookConfig() })

roleHandler.openapi(roleRoute.create, async (c) => {
  const body = c.req.valid('json')
  const sub = c.get('jwtPayload').sub
  const result = await roleService.create({...body, createdBy: sub})
  return responseJson.CREATED(c, result, 'Role created successfully')
})

roleHandler.openapi(roleRoute.findAll, async (c) => {
  const { rows, pagination } = await roleService.findAll(c.req.valid('query'))
  return responseJson.OK(c, rows, 'Roles retrieved successfully', pagination)
})

roleHandler.openapi(roleRoute.findOne, async (c) => {
  const { id } = c.req.valid('param')
  const user = await roleService.findOne(id)
  return responseJson.OK(c, user, 'Role found')
})

roleHandler.openapi(roleRoute.update, async (c) => {
  const body = c.req.valid('json')
  const id = c.req.valid('param').id
  const sub = c.get('jwtPayload').sub
  const result = await roleService.update(id, {...body, createdBy: sub})
  return responseJson.OK(c, result, 'Role updated successfully')
})

roleHandler.openapi(roleRoute.remove, async (c) => {
  const id = c.req.valid('param').id
  await roleService.remove(id)
  return responseJson.OK(c, null, "Role deleted successfully")
})

export default roleHandler
