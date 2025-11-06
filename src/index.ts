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
import adminRoute from './routes/admin.route';

const app = new OpenAPIHono();

app.use('/api/*', cors({
  origin: (origin) => {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
    return allowedOrigins.includes(origin) ? origin : '';
  },
  allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header', 'Upgrade-Insecure-Requests'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

app.use(logger(httpLogging))
app.get('/', (c) => {
  return c.text('Welcome')
})

app.doc31('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'Role Base Access Control (RBAC) Management API',
    version: 'v1',
    description: 'This is a simple API for Role Base Access Control (RBAC) management',
    license: { name: "by Anzeru HREF", url: "https://github.com/href0/" },
    contact: {email: "href.dev@gmail.com", name: "Anzeru HREF", url: "https://github.com/href0/"},
  },
  servers: [
    { url: 'http://localhost:8888', description: 'Local server' },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication management endpoints'
    },
    {
      name: 'Users',
      description: 'Users management endpoints',
    },
    {
      name: 'Roles',
      description: 'Roles management endpoints',
    },
  ],
})

app.get('/swagger-doc', swaggerUI({ url: '/doc' }))
app.route('/api/auth', authHandler)
app.use('/api/*', authMiddleware)

// Protected API


// Private API
app.use(roleMiddleware)
app.route('/api/admin', adminRoute)
app.onError(errorHandler)

export default {  
  port: Number(Bun.env.PORT) ?? 8888, 
  fetch: app.fetch,
  hostname: "0.0.0.0"
} 