import { OpenAPIHono } from '@hono/zod-openapi'
import userHandler from '../modules/user/user.handler'
import roleHandler from '../modules/role/role.handler'
import menuHandler from '../modules/menu/menu.handler'

const app = new OpenAPIHono()
app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type : 'http',
  scheme : 'bearer'
})
app.route('/users', userHandler)
app.route('/roles', roleHandler)
app.route('/menus', menuHandler)

export default app