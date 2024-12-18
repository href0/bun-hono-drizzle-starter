import { OpenAPIHono } from '@hono/zod-openapi'
import userHandler from '../modules/user/user.handler'

const app = new OpenAPIHono()
app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type : 'http',
  scheme : 'bearer'
})
app.route('/users', userHandler)

export default app