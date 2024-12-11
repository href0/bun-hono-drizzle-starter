import { z } from "zod";
import { errorResponseSchema, metaSchema, metaSchemaWithPagination, paginationSchema } from "../schemas/common.schema";

export type MetaSchema = z.infer<typeof metaSchema>
export type MetaSchemaWithPagination = z.infer<typeof metaSchemaWithPagination>

export type SuccessResponse<T> = {
  message: string;
  data: T;
  meta: MetaSchema | MetaSchemaWithPagination;
};

export type PaginationResponse<T> = {
  message: string;
  data: T[];
  meta: MetaSchemaWithPagination;
};
export type PaginationMeta = z.infer<typeof paginationSchema>;
export type Meta = z.infer<typeof metaSchema>;
export type ResponseError = z.infer<typeof errorResponseSchema>