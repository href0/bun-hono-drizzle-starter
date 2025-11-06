import { Context } from 'hono';
import { HttpStatusCode } from '../utils/types/http.type';
import { ErrorResponse } from '../utils/types/error.type';
import { AppError } from '../utils/errors/base.error';
import { env } from 'hono/adapter'
import { API_VERSION } from '../utils/constants/app.constant';
import { logger } from '../config/logger.config';
import { JwtTokenExpired, JwtTokenInvalid, JwtTokenIssuedAt, JwtTokenNotBefore } from 'hono/utils/jwt/types';
import { NodeEnv } from '../utils/interfaces/env.interface';
import { ERROR_MESSAGES } from '../utils/constants/error.constant';

export const errorHandler = (error : Error, c : Context) => {
   // Handle unknown errors
   let statusCode : HttpStatusCode = 500
   let response: ErrorResponse = {
    message : "Internal Server Error",
    errors : "Something went wrong, try again later.",
    meta : {
      timestamp : new Date(),
      version : API_VERSION
    },
  };

  if (error instanceof AppError) {
    statusCode = error.statusCode
    response.message = error.message
    response.errors = statusCode !== 500 ? error.errors : null
  } else if (error instanceof JwtTokenInvalid) {
    statusCode = 401;
    response.message = ERROR_MESSAGES.UNAUTHORIZED
    response.errors = "Invalid authentication token provided";
  }
  else if (error instanceof JwtTokenNotBefore) {
    statusCode = 401;
    response.message = ERROR_MESSAGES.TOKEN_EXPIRED
    response.errors = "Token cannot be used yet - check token's NBF (Not Before) date";
  }
  else if (error instanceof JwtTokenExpired) {
    statusCode = 401;
    response.message = ERROR_MESSAGES.TOKEN_EXPIRED
    response.errors = "Authentication token has expired. Please sign in again";
  }
  else if (error instanceof JwtTokenIssuedAt) {
    statusCode = 401;
    response.message = ERROR_MESSAGES.TOKEN_EXPIRED
    response.errors = "Token has an invalid issued date (IAT claim)";
  } 
  
  // Add stack trace in development
  const { NODE_ENV } = env<{ NODE_ENV: string }>(c)
  if (NODE_ENV === NodeEnv.DEV) {
    response.stack = error.stack;
  }
  logger.error(response.message, {level : 'error', errors : response.errors, stack : error.stack})
  return c.json(response, statusCode);
};