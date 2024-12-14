import { Context, Next } from "hono";
import { UnauthorizedError } from "../utils/errors/http.error";
import { verifyJWT } from "../utils/helpers/jwt.helper";

export const authMiddleware =  async(c: Context, next:Next) => {
  const token = c.req.header('Authorization')?.split(" ")[1]
  if(!token) throw new UnauthorizedError('Invalid token provided')
  const decoded = await verifyJWT(token)  
  c.set('jwtPayload', decoded)
  await next()
}