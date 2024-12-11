import { OpenAPIHono } from "@hono/zod-openapi"
import { API_VERSION } from "../utils/constants/app.constant"
import { env } from "hono/adapter";
import { ResponseError } from "../utils/types/response.type";

export const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      const response : ResponseError = {
        message : 'Validation error',
        errors : result.error.issues,
        meta : {
          timestamp : new Date(),
          version : API_VERSION,
        }
      }
      const { NODE_ENV } = env<{ NODE_ENV: string }>(c)
      if (NODE_ENV === 'development') {
        response.stack = result.error.toString();
      }
      return c.json(response, 422)
    }
  },
})
