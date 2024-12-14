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
    responses:OpenAPIResponseHelper.createSuccessResponse(responseUserSchema, 'Get all user with pagination')
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
    responses:OpenAPIResponseHelper.createSuccessResponse(responseSignInAuthSchema, 'Get all user with pagination')
  })
}

export const authRoute = new AuthRoute()