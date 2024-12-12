import { OpenAPIHono } from '@hono/zod-openapi'
import userRoute from './user/user.handler'

const app = new OpenAPIHono()

app.route('/user', userRoute)

export default app