import { Context } from "hono"
import { API_VERSION } from "../constants/app.constant"
import { BaseResponseParams, PaginationMeta, SuccessResponse, SuccessResponseWithPagination } from "../types/response.type"

const createSuccessResponse = <T>({ message, data, pagination }: BaseResponseParams<T>): SuccessResponse<T> | SuccessResponseWithPagination<T> => {
  const baseResponse: SuccessResponse<T> = {
    message,
    data,
    meta: {
      timestamp: new Date(),
      version: API_VERSION,
    }
  }

  if (pagination) {
    return {
      message,
      data,
      meta: {
        timestamp: new Date(),
        version: API_VERSION,
        pagination
      }
    } as SuccessResponseWithPagination<T>
  }

  return baseResponse
}

export const responseJson =  {
  "CREATED" : <T>(c : Context, data : T, message : string = 'Created Successfully') => {
    return c.json(createSuccessResponse({message, data}), 201)
  },
  "OK" : <T>(c : Context, data : T, message : string = 'Success', pagination: PaginationMeta | null = null) => {
    return c.json(createSuccessResponse({ message, data, pagination }), 200)
  },
}