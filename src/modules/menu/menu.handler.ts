import { responseJson } from '../../utils/helpers/response.helper';
import { OpenAPIHono } from '@hono/zod-openapi';
import { defaultHookConfig } from '../../config/app.config';
import { menuRoute } from './menu.route';
import { menuService } from './menu.service';

const menuHandler = new OpenAPIHono({ defaultHook: defaultHookConfig() })

menuHandler.openapi(menuRoute.create, async (c) => {
  const body = c.req.valid('json')
  const sub = c.get('jwtPayload').sub
  const result = await menuService.create({...body, createdBy: sub})
  return responseJson.CREATED(c, result, 'Menu created successfully')
})

menuHandler.openapi(menuRoute.findAll, async (c) => {
  const { rows, pagination } = await menuService.findAll(c.req.valid('query'))
  return responseJson.OK(c, rows, 'Menus retrieved successfully', pagination)
})

menuHandler.openapi(menuRoute.findOne, async (c) => {
  const { id } = c.req.valid('param')
  const user = await menuService.findOne(id)
  return responseJson.OK(c, user, 'Menu found')
})

menuHandler.openapi(menuRoute.update, async (c) => {
  const body = c.req.valid('json')
  const id = c.req.valid('param').id
  const sub = c.get('jwtPayload').sub
  const result = await menuService.update(id, {...body, updatedBy: sub})
  return responseJson.OK(c, result, 'Menu updated successfully')
})

menuHandler.openapi(menuRoute.remove, async (c) => {
  const id = c.req.valid('param').id
  await menuService.remove(id)
  return responseJson.OK(c, null, "Menu deleted successfully")
})

export default menuHandler
