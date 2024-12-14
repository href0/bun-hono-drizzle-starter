import { JWTPayload } from "hono/utils/jwt/types"

export interface JWTPayloadUser extends JWTPayload {
  sub: number
  name: string
  email: string
}