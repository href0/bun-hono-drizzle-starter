import { Context } from "hono"
import { API_VERSION } from "../constants/app.constant"
import { MetaSchema, MetaSchemaWithPagination, SuccessResponse } from "../types/response.type"

const baseResponse = <T>(message : string, data : T, meta : MetaSchema | MetaSchemaWithPagination | null) =>{
  const response : SuccessResponse<T> = {
    message : message,
    data : data,
    meta : {
      timestamp : new Date(),
      version : API_VERSION,
      ...meta
    }
  }
  return response
}

export const responseJson =  {
  "CREATED" : <T>(c : Context, data : T, message : string = 'Created Successfully',  meta : MetaSchema | null = null) => {
    return c.json(baseResponse(message, data, meta), 201)
  },
  "OK" : <T>(c : Context, data : T, message : string = 'Success', meta : MetaSchemaWithPagination | null = null) => {
    return c.json(baseResponse(message, data, meta), 200)
  },
}