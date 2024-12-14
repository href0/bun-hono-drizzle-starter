import { Context, Next } from "hono"

export const roleMiddleware = async (c: Context, next: Next) => {
  const payload = c.get('jwtPayload')
  // role validation here
  await next()
}
