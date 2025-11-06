import { Context } from "hono"
import { API_VERSION } from "../constants/app.constant"
import { BaseResponseParams, PaginationMeta, SuccessResponse, SuccessResponseWithPagination } from "../types/response.type"
import z, { ZodTypeAny, infer as zInfer } from "zod";

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
  CREATED : <T>(c : Context, data : T, message : string = 'Created Successfully') => {
    return c.json(createSuccessResponse({message, data}), 201)
  },
  OK : <T>(c : Context, data : T, message : string = 'Success', pagination: PaginationMeta | null = null) => {
    return c.json(createSuccessResponse({ message, data, pagination }), 200)
  },
  OK_WITH_SCHEMA: <T extends ZodTypeAny>(
    c: Context,
    schema: T,
    raw: unknown,
    message: string = "Success",
  ) => {
    const data = buildResponse(schema, raw); // ✅ validasi lewat Zod
    return c.json(createSuccessResponse({ message, data }), 200);
  },
  PAGINATED: <T extends ZodTypeAny>(
    c: Context,
    schema: T,
    raw: Array<z.input<T>>,
    message: string = "Success",
    pagination: PaginationMeta
  ) => {
    if (!Array.isArray(raw)) {
      throw new Error("PAGINATED response expects raw to be an array");
    }
    const data = buildResponse(z.array(schema), raw); // ✅ validasi lewat Zod
    return c.json(createSuccessResponse({ message, data, pagination }), 200);
  },
  NO_DATA:(
    c: Context,
    message: string = "Success",
  ) => {
    return c.json(createSuccessResponse({ message, data: null }), 200);
  },
}

/**
 * Helper generic untuk mem-parse raw data berdasarkan Zod schema.
 * Tujuan: menyatukan pattern .parse() agar konsisten di seluruh modul.
 */
export function buildResponse<T extends ZodTypeAny>(
  schema: T,
  raw: unknown
): zInfer<T> {
  return schema.parse(raw);
}