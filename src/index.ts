// import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui';
import { errorHandler } from './utils/middlewares/error.middleware';
import { logger } from 'hono/logger'
import apiRoute from './api/index'
import { cors } from 'hono/cors'
import { OpenAPIHono } from '@hono/zod-openapi';
import { customLogger } from './utils/middlewares/logger.middleware';
const app = new OpenAPIHono()

app.use(logger(customLogger))
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
    // {
    //   name: 'Auth',
    //   description: 'Authentication endpoints'
    // }
  ],
})

app.get('/swagger-doc', swaggerUI({ url: '/doc' }))
app.use('/api/*', cors())
app.route('/api', apiRoute)
app.onError(errorHandler)

export default {  
  port: Bun.env.PORT ?? 3000, 
  fetch: app.fetch,
} 