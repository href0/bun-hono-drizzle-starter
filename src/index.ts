// import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui';
import { errorHandler } from './middlewares/error.middleware';
import { logger } from 'hono/logger'
import apiRoute from './routes/index'
import { cors } from 'hono/cors'
import { OpenAPIHono } from '@hono/zod-openapi';
import { httpLogging } from './middlewares/http-logging.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { roleMiddleware } from './middlewares/role.middleware';
import authHandler from './modules/auth/auth.handler';
const app = new OpenAPIHono()

app.use('/api/*', cors({
  origin: '*', // atau domain spesifik Anda
  allowMethods: ['POST', 'GET', 'OPTIONS'], // pastikan POST diizinkan
  allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header', 'Upgrade-Insecure-Requests'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

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
app.route('/api/auth', authHandler)
app.use('/api/*', authMiddleware, roleMiddleware)
app.route('/api', apiRoute)
app.onError(errorHandler)

export default {  
  port: Number(Bun.env.PORT) ?? 8888, 
  fetch: app.fetch,
  hostname: "0.0.0.0"
} 