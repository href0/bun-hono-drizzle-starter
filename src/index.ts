// import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui';
import { errorHandler } from './middlewares/error.middleware';
import { logger } from 'hono/logger'
import apiRoute from './routes/index'
import { cors } from 'hono/cors'
import { OpenAPIHono } from '@hono/zod-openapi';
import { httpLogging } from './middlewares/http-logging.middleware';
import { JwtVariables } from 'hono/jwt';
import { authMiddleware } from './middlewares/auth.middleware';
import { roleMiddleware } from './middlewares/role.middleware';
import authHandler from './modules/auth/auth.handler';

type Variables = JwtVariables
const app = new OpenAPIHono<{ Variables: Variables }>()

app.use(logger(httpLogging))
app.get('/', (c) => {
  return c.text('Welcome')
})

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'User Management API',
    version: 'v1'
  },
  tags: [
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Auth',
      description: 'Authentication endpoints'
    }
  ],
})

app.get('/swagger-doc', swaggerUI({ url: '/doc' }))
app.use('/api/*', cors())
app.route('/api/auth', authHandler)
app.use('/api/*', authMiddleware, roleMiddleware)
app.route('/api', apiRoute)
app.onError(errorHandler)

export default {  
  port: Bun.env.PORT ?? 3000, 
  fetch: app.fetch,
} 