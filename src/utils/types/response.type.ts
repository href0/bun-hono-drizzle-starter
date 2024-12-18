import { z } from "zod";
import { successResponseSchema, successResponseWithPaginationSchema } from "../schemas/response.schema";
import { errorResponseSchema } from "../schemas/response.schema";
import { metaSchema, metaSchemaWithPagination, paginationSchema } from "../schemas/pagination.schema";

export type MetaSchema = z.infer<typeof metaSchema>
export type MetaSchemaWithPagination = z.infer<typeof metaSchemaWithPagination>
export type SuccessResponse<T> = z.infer<ReturnType<typeof successResponseSchema<z.ZodType<T>>>>
export type SuccessResponseWithPagination<T> = z.infer<ReturnType<typeof successResponseWithPaginationSchema<z.ZodType<T>>>>
export type BaseResponseParams<T> = {
  message: string;
  data: T;
  pagination?: PaginationMeta | null;
}

export type PaginationMeta = z.infer<typeof paginationSchema>;
export type Meta = z.infer<typeof metaSchema>;
export type ResponseError = z.infer<typeof errorResponseSchema>