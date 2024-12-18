import { z } from "zod"
import { errorResponseSchema } from "../schemas/response.schema"

export type ErrorResponse = z.infer<typeof errorResponseSchema>