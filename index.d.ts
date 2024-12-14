import { JWTPayloadUser } from './src/utils/interfaces/jwt.interface'

declare module 'hono' {
  interface ContextVariableMap {
    jwtPayload: JWTPayloadUser      
  }
}