import { sign, verify } from 'hono/jwt'
import { ACCESS_TOKEN_EXPIRED, ACCESS_TOKEN_SECRET_KEY, REFREH_TOKEN_EXPIRED, REFRESH_TOKEN_SECRET_KEY } from '../constants/app.constant'
import { JWTPayloadUser } from '../interfaces/jwt.interface'

export enum TokenType {
  ACCESS,
  REFRESH
}
export const generateJWT = async(payload: JWTPayloadUser, type: TokenType = TokenType.ACCESS) => {
  payload['exp'] = type === TokenType.REFRESH ? REFREH_TOKEN_EXPIRED : ACCESS_TOKEN_EXPIRED
  const secretKey = type === TokenType.REFRESH ? REFRESH_TOKEN_SECRET_KEY : ACCESS_TOKEN_SECRET_KEY
  if(!secretKey) throw new Error('Secret key required!')
  const token = await sign(payload, secretKey)
  return token
}

export const verifyJWT = async(token: string, type: TokenType = TokenType.ACCESS) => {
  const secretKey = type === TokenType.REFRESH ? REFRESH_TOKEN_SECRET_KEY : ACCESS_TOKEN_SECRET_KEY
  if(!secretKey) throw new Error('Secret key required!')
  const decodedPayload = await verify(token, "secretKey") as JWTPayloadUser
  return decodedPayload
}