import { HttpStatusCode } from "../types/http.type";
import { HTTPException } from 'hono/http-exception'
export abstract class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    message: string,
    public errors: unknown = null,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}