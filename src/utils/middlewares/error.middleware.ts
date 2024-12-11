import { Context } from 'hono';
import { HttpStatusCode } from '../types/http.type';
import { ErrorResponse } from '../types/error.type';
import { AppError } from '../errors/base.error';
import { env } from 'hono/adapter'
import { API_VERSION } from '../constants/app.constant';
import { ZodError } from 'zod';

export const errorHandler = (error : Error, c : Context) => {
  console.error('Error:', error);

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
    response.errors = error.errors
  } else if (error instanceof ZodError) {
    console.log('aaaa zod')
  }

  // Add stack trace in development
  const { NODE_ENV } = env<{ NODE_ENV: string }>(c)
  if (NODE_ENV === 'development') {
    response.stack = error.stack;
  }
 
  return c.json(response, statusCode);
};