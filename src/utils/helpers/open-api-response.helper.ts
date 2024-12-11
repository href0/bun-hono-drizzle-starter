import { z } from '@hono/zod-openapi'
import { errorResponseSchema, successResponseSchema } from '../schemas/common.schema'

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
          schema: errorResponseSchema,
        },
      },
      description: 'Unauthorized',
    },
    403: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Forbidden',
    },
    404: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Not Found',
    },
    422: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
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
  static createSuccessResponse<T extends z.ZodType>(dataSchema: T | null, description : string = 'Successful response') {
    const responseSchema = successResponseSchema(dataSchema)
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

  static createSuccessWithPaginationResponse<T extends z.ZodType>(dataSchema: T, description : string = 'Successful response') {
    const responseSchema = successResponseSchema(z.array(dataSchema), true)
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

  static createCreatedResponse<T extends z.ZodType>(dataSchema: T, description : string = 'Created successfully') {
    const responseSchema = successResponseSchema(dataSchema)
    return {
      201: {
        content: {
          'application/json': {
            schema: responseSchema
          }
        },
        description: description
      },
      422 : this.errorResponses[422]
    }
  }

  static createCustomResponse<T extends z.ZodType>(dataSchema: T) {
    const responseSchema = successResponseSchema(dataSchema)
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