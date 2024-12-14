import { z } from '@hono/zod-openapi'
import { responseUserSchema } from '../user/user.schema'

export const signUpAuthSchema = z.object({
  email: z.string().email().openapi({ example : "john@gmail.com" }),
  name: z.string().min(5).openapi({ example : "john doe" }),
  password: z.string().min(6).openapi({ example : "password" }),
}).openapi('Sign Up')

export const signInAuthSchema = z.object({
  email: z.string().email().openapi({ example : "john@gmail.com" }),
  password: z.string().min(6).openapi({ example : "password" }),
}).openapi('Sign In')

export const responseSignInAuthSchema = responseUserSchema.extend({
  accessToken: z.string().openapi({ example : "askdioasuids90adjasiodjas" }),
})