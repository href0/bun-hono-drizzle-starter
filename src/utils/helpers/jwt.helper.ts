import { sign, verify } from 'hono/jwt'
import { ACCESS_TOKEN_DURATION, ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_DURATION, REFRESH_TOKEN_SECRET_KEY } from '../constants/app.constant'
import { JWTPayloadUser } from '../interfaces/jwt.interface'

export enum TokenType {
  ACCESS,
  REFRESH
}
export const generateJWT = async(payload: JWTPayloadUser, type: TokenType = TokenType.ACCESS) => {
  const now = Math.floor(Date.now() / 1000)
  const duration = type === TokenType.REFRESH ? REFRESH_TOKEN_DURATION : ACCESS_TOKEN_DURATION 
  payload['exp'] = now + duration
  payload['iat'] = now  
  const secretKey = type === TokenType.REFRESH ? REFRESH_TOKEN_SECRET_KEY : ACCESS_TOKEN_SECRET_KEY
  if(!secretKey) throw new Error('Secret key required!')
  const token = await sign(payload, secretKey,)
  return token
}

export const verifyJWT = async(token: string, type: TokenType = TokenType.ACCESS) => {
  const secretKey = type === TokenType.REFRESH ? REFRESH_TOKEN_SECRET_KEY : ACCESS_TOKEN_SECRET_KEY
  if(!secretKey) throw new Error('Secret key required!')
  const decodedPayload = await verify(token, secretKey) as JWTPayloadUser
  return decodedPayload
}