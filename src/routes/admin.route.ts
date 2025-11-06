import { OpenAPIHono } from '@hono/zod-openapi'
import userHandler from '../modules/admin/user/user.handler'
import roleHandler from '../modules/admin/role/role.handler'
import menuHandler from '../modules/admin/menu/menu.handler'
import permissionHandler from '../modules/admin/permission/permission.handler'

const app = new OpenAPIHono()
app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type : 'http',
  scheme : 'bearer'
})
 
app.route('/users', userHandler)
app.route('/roles', roleHandler)
app.route('/menus', menuHandler)
app.route('/permissions', permissionHandler)

export default app