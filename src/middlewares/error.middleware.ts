import { Context } from 'hono';
import { HttpStatusCode } from '../utils/types/http.type';
import { ErrorResponse } from '../utils/types/error.type';
import { AppError } from '../utils/errors/base.error';
import { env } from 'hono/adapter'
import { API_VERSION } from '../utils/constants/app.constant';
import { logger } from '../config/logger.config';
import { JwtTokenExpired, JwtTokenInvalid, JwtTokenIssuedAt, JwtTokenNotBefore } from 'hono/utils/jwt/types';

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
    response.message = 'Unauthorized'
    response.errors = "Invalid authentication token provided";
  }
  else if (error instanceof JwtTokenNotBefore) {
    statusCode = 401;
    response.message = 'Unauthorized'
    response.errors = "Token cannot be used yet - check token's NBF (Not Before) date";
  }
  else if (error instanceof JwtTokenExpired) {
    statusCode = 401;
    response.message = 'Unauthorized'
    response.errors = "Authentication token has expired. Please log in again";
  }
  else if (error instanceof JwtTokenIssuedAt) {
    statusCode = 401;
    response.message = 'Unauthorized'
    response.errors = "Token has an invalid issued date (IAT claim)";
  } 
  
  // Add stack trace in development
  const { NODE_ENV } = env<{ NODE_ENV: string }>(c)
  if (NODE_ENV === 'development') {
    response.stack = error.stack;
  }
  logger.error(response.message, {level : 'error', errors : response.errors, stack : NODE_ENV === 'development' ? error.stack : null})
  return c.json(response, statusCode);
};