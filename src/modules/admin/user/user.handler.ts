import { responseJson } from '../../../utils/helpers/response.helper';
import { userRoute } from './user.route';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { defaultHookConfig } from '../../../config/app.config';
import { userDetailResponseSchema, userResponseSchema } from './user.schema';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

const userHandler = new OpenAPIHono({ defaultHook: defaultHookConfig() })
const userService = new UserService(new UserRepository())

userHandler.openapi(userRoute.create, async (c) => {
  const body = c.req.valid('json')
  const sub = c.get('jwtPayload').sub 
  const result = await userService.create(body, sub)
  return responseJson.CREATED(c, result)
})

userHandler.openapi(userRoute.findAll, async (c) => {
  const { rows, pagination } = await userService.getAll(c.req.valid('query'))

  return responseJson.PAGINATED(c, userResponseSchema, rows, 'Users retrieved successfully', pagination)
})

userHandler.openapi(userRoute.findOne, async (c) => {
  const { id } = c.req.valid('param')
  const user = await userService.getById(id)
  return responseJson.OK_WITH_SCHEMA(c, userDetailResponseSchema, user, 'User found')
})

userHandler.openapi(userRoute.update, async (c) => {
  const { id } = c.req.valid('param')
  const request = c.req.valid('json')
  const sub = c.get('jwtPayload').sub 
  const user = await userService.update(id, request, sub)
  return responseJson.OK_WITH_SCHEMA(c, userResponseSchema, user, 'User updated successfully')
})

userHandler.openapi(userRoute.updatePassword, async (c) => {
  const { id } = c.req.valid('param')
  const { password } = c.req.valid('json')
  const sub = c.get('jwtPayload').sub 
  const user = await userService.updatePassword(id, password, sub)
  return responseJson.OK_WITH_SCHEMA(c, userResponseSchema, user, 'User password updated successfully')
})

userHandler.openapi(userRoute.remove, async(c) => {
  const { id } = c.req.valid('param')
  await userService.remove(id)
  return responseJson.NO_DATA(c, 'User delete successfully')
})

export default userHandler