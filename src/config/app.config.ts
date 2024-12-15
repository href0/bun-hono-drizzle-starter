import { API_VERSION } from "../utils/constants/app.constant"
import { env } from "hono/adapter";
import { ResponseError } from "../utils/types/response.type";
import { logger } from "./logger.config";
import { ERROR_MESSAGES } from "../utils/constants/error.constant";
import { Context } from "hono";
import { ZodError } from "zod";
import { NodeEnv } from "../utils/interfaces/env.interface";

export const defaultHookConfig = () => {
  return (result: { success: boolean, error?: ZodError }, c: Context) => {
    if (!result.success) {
      const { NODE_ENV } = env<{ NODE_ENV: string }>(c)
      
      logger.error(ERROR_MESSAGES.VALIDATION_ERROR, {
        level: 'error',
        errors: result.error?.issues,
        stack: NODE_ENV === NodeEnv.DEV ? JSON.stringify(result.error) : null
      })

      const response: ResponseError = {
        message: 'Validation error',
        errors: result.error?.issues || [],
        meta: {
          timestamp: new Date(),
          version: API_VERSION,
        }
      }

      if (NODE_ENV === NodeEnv.DEV) {
        response.stack = result.error?.toString()
      }

      return c.json(response, 422)
    }
  }
}
