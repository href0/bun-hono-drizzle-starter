import { userSchemaRoute } from './user.schema';
import { responseJson } from '../../utils/helpers/response.helper';
import { userService } from './user.service';
import { app } from '../../config/app.config';

app.openapi(userSchemaRoute.create, async (c) => {
  const body = c.req.valid('json')
  const result = await userService.create(body)
  return responseJson.CREATED(c, result)
})

app.openapi(userSchemaRoute.findAll, async (c) =>{
  const { rows, pagination } = await userService.findAll(c.req.valid('query'))
  return responseJson.OK(c, rows, 'Users retrieved successfully', pagination)
})

app.openapi(userSchemaRoute.findOne, async (c) => {
  const { id } = c.req.valid('param')
  const user = await userService.findOne(id)
  return responseJson.OK(c, user, 'User found')
})

app.openapi(userSchemaRoute.update, async (c) => {
  const { id } = c.req.valid('param')
  const request = c.req.valid('json')
  const user = await userService.update(id, request)
  return responseJson.OK(c, user, 'User updated successfully')
})

app.openapi(userSchemaRoute.updatePassword, async (c) => {
  const { id } = c.req.valid('param')
  const { password } = c.req.valid('json')
  const user = await userService.updatePassword(id, password)
  return responseJson.OK(c, user, 'User password updated successfully')
})

app.openapi(userSchemaRoute.remove, async(c) => {
  const { id } = c.req.valid('param')
  await userService.remove(id)
  return responseJson.OK(c, null, 'User delete successfully')
})

export default app