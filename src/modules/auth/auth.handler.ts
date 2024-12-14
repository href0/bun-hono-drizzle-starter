import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHookConfig } from "../../config/app.config";
import { authRoute } from "./auth.route";
import { responseJson } from "../../utils/helpers/response.helper";
import { userService } from "../user/user.service";
import { db } from "../../config/db.config";
import { usersTable } from "../../models/user.model";
import { eq } from "drizzle-orm";
import { BadRequestError } from "../../utils/errors/http.error";
import { generateJWT, TokenType } from "../../utils/helpers/jwt.helper";
import { ResponseSignInAuthSchema } from "./auth.type";
import { setCookie } from 'hono/cookie'
import { JWTPayloadUser } from "../../utils/interfaces/jwt.interface";
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
  setCookie(c, 'refreshToken', refreshToken)
  return responseJson.OK(c, result)
})

export default authHandler