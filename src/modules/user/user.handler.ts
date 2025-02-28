import { responseJson } from '../../utils/helpers/response.helper';
import { userService } from './user.service';
import { userRoute } from './user.route';
import { OpenAPIHono } from '@hono/zod-openapi';
import { defaultHookConfig } from '../../config/app.config';

const userHandler = new OpenAPIHono({ defaultHook: defaultHookConfig() })

userHandler.openapi(userRoute.create, async (c) => {
  const body = c.req.valid('json')
  const result = await userService.create(body)
  return responseJson.CREATED(c, result)
})

userHandler.openapi(userRoute.findAll, async (c) => {
  const { rows, pagination } = await userService.findAll(c.req.valid('query'))
  return responseJson.OK(c, rows, 'Users retrieved successfully', pagination)
})

userHandler.openapi(userRoute.findOne, async (c) => {
  const { id } = c.req.valid('param')
  const user = await userService.findOne(id)
  return responseJson.OK(c, user, 'User found')
})

userHandler.openapi(userRoute.update, async (c) => {
  const { id } = c.req.valid('param')
  const request = c.req.valid('json')
  const sub = c.get('jwtPayload').sub
  const user = await userService.update(id, { ...request, updatedBy: sub })
  return responseJson.OK(c, user, 'User updated successfully')
})

userHandler.openapi(userRoute.updatePassword, async (c) => {
  const { id } = c.req.valid('param')
  const { password } = c.req.valid('json')
  const user = await userService.updatePassword(id, password)
  return responseJson.OK(c, user, 'User password updated successfully')
})

userHandler.openapi(userRoute.remove, async(c) => {
  const { id } = c.req.valid('param')
  await userService.remove(id)
  return responseJson.OK(c, null, 'User delete successfully')
})

export default userHandler