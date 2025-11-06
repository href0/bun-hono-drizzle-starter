import { z } from '@hono/zod-openapi'
import { successResponseSchema, successResponseWithPaginationSchema, errorResponseSchema, zodIssueSchema } from '../schemas/response.schema'
import { metaSchema } from '../schemas/pagination.schema'
import { ERROR_MESSAGES } from '../constants/error.constant'

export class OpenAPIResponseHelper {
  private static readonly errorResponses = {
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Bad Request',
    },
    401: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: ERROR_MESSAGES.UNAUTHORIZED }),
            errors: z.string().optional().openapi({ example: 'Invalid token' }),
            meta: metaSchema,
            stack: z.string().optional()
          }),
        },
      },
      description: 'Unauthorized',
    },
    403: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: ERROR_MESSAGES.FORBIDDEN }),
            errors: z.string().optional().openapi({ example: 'You do not have permission to access this resource' }),
            meta: metaSchema,
            stack: z.string().optional()
          }),
        },
      },
      description: 'Forbidden',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: ERROR_MESSAGES.NOT_FOUND }),
            errors: z.string().optional().openapi({ example: 'Data not found' }),
            meta: metaSchema,
            stack: z.string().optional()
          }),
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: z.array(zodIssueSchema).openapi({
            example: [
              {
                code: "invalid_type",
                expected: "string",
                received: "number",
                message: "Expected string, received number",
                path: ["email"]
              },
              {
                code: "invalid_string",
                validation: "email",
                message: "Invalid email address",
                path: ["email"]
              },
              {
                code: "too_small",
                minimum: 6,
                inclusive: true,
                type: "string",
                message: "String must contain at least 6 character(s)",
                path: ["password"]
              },
              {
                code: "too_big",
                maximum: 100,
                inclusive: true,
                type: "string",
                message: "String must contain at most 100 character(s)",
                path: ["username"]
              },
              {
                code: "invalid_enum_value",
                options: ["admin", "user", "guest"],
                received: "root",
                message: "Invalid enum value. Expected 'admin' | 'user' | 'guest'",
                path: ["role"]
              },
              {
                code: "unrecognized_keys",
                keys: ["unexpectedField"],
                message: "Unrecognized key(s) in object: 'unexpectedField'",
                path: []
              },
              {
                code: "invalid_union",
                message: "Invalid input",
                path: ["contact"]
              },
              {
                code: "invalid_union_discriminator",
                options: ["email", "phone"],
                message: "Invalid discriminator value",
                path: ["contact", "type"]
              },
              {
                code: "invalid_date",
                message: "Invalid date",
                path: ["birthdate"]
              },
              {
                code: "not_multiple_of",
                multipleOf: 5,
                message: "Number must be a multiple of 5",
                path: ["quantity"]
              },
              {
                code: "invalid_literal",
                expected: "ACTIVE",
                message: "Invalid literal value",
                path: ["status"]
              },
              {
                code: "invalid_intersection_types",
                message: "Intersection types are not compatible",
                path: ["profile"]
              },
              {
                code: "custom",
                message: "Password and confirmation do not match",
                path: ["confirmPassword"]
              },
              {
                code: "custom",
                message: "Date must be in the future",
                path: ["startDate"]
              }
            ]

          }),
        },
      },
      description: 'Unprocessable Entity',
    },
    500: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Internal Server Error',
    },
  }

  /**
   * Create success response schema for single item
   */
  static createSuccessResponse<T extends z.ZodType>(dataSchema: T | null, description: string = 'Successful response') {

    const responseSchema = successResponseSchema(dataSchema, description)
    return {
      200: {
        content: {
          'application/json': {
            schema: responseSchema
          }
        },
        description: description
      },
    }
  }

  static createSuccessWithPaginationResponse<T extends z.ZodType>(dataSchema: T, description: string = 'Successful response') {
    const responseSchema = successResponseWithPaginationSchema(z.array(dataSchema))
    return {
      200: {
        content: {
          'application/json': {
            schema: responseSchema
          }
        },
        description: description
      },
      400: this.errorResponses[400],
      // 401: this.errorResponses[401],
      // 403: this.errorResponses[403],
      // 500: this.errorResponses[500],
    }
  }

  static createCreatedResponse<T extends z.ZodType>(dataSchema: T, description: string = 'Created successfully') {
    const responseSchema = successResponseSchema(dataSchema, description)
    return {
      201: {
        content: {
          'application/json': {
            schema: responseSchema
          }
        },
        description: description
      },
      // 422: this.errorResponses[422],
      400: this.errorResponses[400],
      // 401: this.errorResponses[401],
      // 403: this.errorResponses[403],
      // 500: this.errorResponses[500],
    }
  }

  static createCustomResponse<T extends z.ZodType>(dataSchema: T) {
    const responseSchema = successResponseSchema(dataSchema, 'success')
    return {
      200: {
        content: {
          'application/json': {
            schema: responseSchema
          }
        },
        description: 'Successful response'
      },
      ...this.errorResponses // Include all error responses by default
    }
  }

  /**
   * Get specific error responses
   */
  static getErrorResponses(...codes: (keyof typeof OpenAPIResponseHelper.errorResponses)[]) {
    const selectedResponses: Record<string, any> = {}
    codes.forEach(code => {
      selectedResponses[code] = OpenAPIResponseHelper.errorResponses[code]
    })
    return selectedResponses
  }

  /**
   * Get all error responses
   */
  static getAllErrorResponses() {
    return this.errorResponses
  }

  // /**
  //  * Create complete response schema with custom success status
  //  */
  // static createCustomResponse<T extends z.ZodType>({
  //   dataSchema,
  //   successCode = 200,
  //   successDescription = 'Successful response',
  //   includeErrorCodes = true
  // }: {
  //   dataSchema: T,
  //   successCode?: number,
  //   successDescription?: string,
  //   includeErrorCodes?: boolean
  // }) {
  //   const successResponse = {
  //     [successCode]: {
  //       content: {
  //         'application/json': {
  //           schema: z.object({
  //             message: z.string(),
  //             data: dataSchema,
  //           })
  //         }
  //       },
  //       description: successDescription
  //     }
  //   }

  //   return includeErrorCodes 
  //     ? { ...successResponse, ...this.errorResponses }
  //     : successResponse
  // }
}