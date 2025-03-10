import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHookConfig } from "../../config/app.config";
import { authRoute } from "./auth.route";
import { responseJson } from "../../utils/helpers/response.helper";
import { userService } from "../user/user.service";
import { db } from "../../config/db.config";
import { usersTable } from "../../models/user.model";
import { eq } from "drizzle-orm";
import { BadRequestError, NotFoundError, TokenExpiredError, UnauthorizedError } from "../../utils/errors/http.error";
import { generateJWT, TokenType, verifyJWT } from "../../utils/helpers/jwt.helper";
import { ResponseSignInAuthSchema } from "./auth.type";
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { JWTPayloadUser } from "../../utils/interfaces/jwt.interface";
import { cookieOptions } from "../../utils/helpers/common.helper";
const authHandler = new OpenAPIHono({defaultHook : defaultHookConfig()})

authHandler.openapi(authRoute.signUp, async(c) => {
  const body = c.req.valid('json')
  const result = await userService.create(body)
  return responseJson.OK(c, result)
})

authHandler.openapi(authRoute.signIn, async(c) => {
  const { email, password } = c.req.valid('json')
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
  if(!user) throw new BadRequestError('Emasil or passwsord wrong!')

  const isPasswordMatch = await Bun.password.verify(password, user.password)
  if(!isPasswordMatch) throw new BadRequestError('Email or passworssd wrong!')
  const payload: JWTPayloadUser = {
    sub: user.id,
    email: user.email,
    name: user.name,
  }

  const [ accessToken, refreshToken ] = await Promise.all([
    generateJWT(payload),
    generateJWT(payload, TokenType.REFRESH),
  ])

  const result : ResponseSignInAuthSchema = { 
    id : user.id,
    name : user.name,
    email : user.email,
    createdAt : user.createdAt,
    updatedAt : user.updatedAt,
    accessToken : accessToken 
  }
  await userService.updateRefreshToken(user.id, refreshToken)
  deleteCookie(c, 'refreshToken', cookieOptions())
  setCookie(c, 'refreshToken', refreshToken, cookieOptions())
  return responseJson.OK(c, result)
})

authHandler.openapi(authRoute.refreshToken, async(c) => {
  const refreshToken = getCookie(c, 'refreshToken')
  if(!refreshToken) throw new TokenExpiredError('Already sign out, please sign in again')

  const decoded = await verifyJWT(refreshToken, TokenType.REFRESH)
  
  const [user] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      refreshToken: usersTable.refreshToken,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, decoded.sub))

  if(!user) throw new NotFoundError('User not found or already removed')
  if(user.refreshToken !== refreshToken) throw new UnauthorizedError('Already sign out, please sign in again')

  const payload: JWTPayloadUser = {
    sub: user.id,
    email: user.email,
    name: user.name,
  }
  const [ accessToken, newRefreshToken ] = await Promise.all([
    generateJWT(payload),
    generateJWT(payload, TokenType.REFRESH),
  ])

  const result : ResponseSignInAuthSchema = { 
    id : user.id,
    name : user.name,
    email : user.email,
    createdAt : user?.createdAt,
    updatedAt : user?.updatedAt,
    accessToken : accessToken
  }
  await userService.updateRefreshToken(user.id, refreshToken)
  deleteCookie(c, 'refreshToken', cookieOptions())
  setCookie(c, 'refreshToken', newRefreshToken, cookieOptions())
  return responseJson.OK(c, result, 'Token refreshed successfully')
})

export default authHandler