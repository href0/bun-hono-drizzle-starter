import { Context } from "hono"
import { ErrorResponse } from "../types/error.type"
import { API_VERSION } from "../constants/app.constant"

export const reponseError = (c : Context, message : string, code : 400 | 401 | 403 | 404 | 422 | 500, errors : object) => {
  
  const validationErrorResponse : ErrorResponse = {
    message : message,
    errors : errors,
    meta : {
      timestamp : new Date(),
      version : API_VERSION,
    }
  }
  return c.json(validationErrorResponse, code)
}