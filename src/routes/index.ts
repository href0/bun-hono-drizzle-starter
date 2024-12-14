import { OpenAPIHono } from '@hono/zod-openapi'
import userHandler from '../modules/user/user.handler'

const app = new OpenAPIHono()
app.route('/user', userHandler)

export default app