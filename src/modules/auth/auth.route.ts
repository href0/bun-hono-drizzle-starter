import { createRoute } from "@hono/zod-openapi";
import { OpenAPIResponseHelper } from "../../utils/helpers/open-api-response.helper";
import { responseUserSchema } from "../user/user.schema";
import { responseSignInAuthSchema, signInAuthSchema, signUpAuthSchema } from "./auth.schema";

class AuthRoute {
  public readonly signUp = createRoute({
    method: 'post',
    path: '/signup',
    tags : ['Auth'],
    request : {
      body : {
        content : {
          "application/json" : {
            schema : signUpAuthSchema
          }
        }
      }
    },
    responses:OpenAPIResponseHelper.createSuccessResponse(responseUserSchema, 'Sign up success')
  })

  public readonly signIn = createRoute({
    method: 'post',
    path: '/signin',
    tags : ['Auth'],
    request : {
      body : {
        content : {
          "application/json" : {
            schema : signInAuthSchema
          }
        }
      }
    },
    responses:OpenAPIResponseHelper.createSuccessResponse(responseSignInAuthSchema, 'Sign in success')
  })

  public readonly refreshToken = createRoute({
    method: 'post',
    path: '/refresh-token',
    tags : ['Auth'],
    responses:OpenAPIResponseHelper.createSuccessResponse(responseSignInAuthSchema, 'Token refreshed successfully')
  })
}

export const authRoute = new AuthRoute()